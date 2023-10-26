import { useTheme } from '@mui/material/styles';
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import OpenAI from 'openai';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  '🙂 Normal',
  '🙃 Informal',
  '📝 Formal',
  '😁 Friendly',
  '🤓 Professional',
];
const letterStyle = [
  '🙂 Conversational',
  '🙃 Formal',
  '📝 Instructive',
  '😁 Friendly',
  '🧐 Authoritative',
  '😂 Humorous',
  '🥺 Empathetic',
  '🫤 Persuasive',
  '🤓 Technical',
  '🎭 Creative',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function LetterGenerator() {
  const theme = useTheme();
  const [counter, setCounter] = useState(0);
  const [tone, setTone] = useState('🙂 Normal');
  const [style, setStyle] = useState('🙂 Conversational');
  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isLimitExceeded = prompt?.length > 300;
  const openApiKey = import.meta.env?.VITE_OPENAI_API_KEY;

  const openai = new OpenAI({
    apiKey: openApiKey,
    dangerouslyAllowBrowser: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await openai.chat.completions
        .create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `${prompt} in ${tone?.split(' ')?.[1]} tone and ${
                style?.split(' ')?.[1]
              } style.`,
            },
          ],
        })
        .then((e) => {
          if (e?.choices?.[0]?.message?.content) {
            console.log('check');
            setCounter((prev) => prev + 1);
            setApiResponse(e?.choices?.[0]?.message?.content);
            setIsCopied(false);
          }
        });
    } catch (e) {
      console.log('error', e);
      setApiResponse('Something is going wrong, Please try again.');
    }
    setLoading(false);
  };

  console.log(apiResponse, 'counter', counter);

  const handleToneChange = (event) => {
    const {
      target: { value },
    } = event;
    setTone(value);
  };

  const handleCopyText = async () => {
    if (!apiResponse) return;
    try {
      await navigator.clipboard.writeText(apiResponse);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSaveText = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='flex h-full lg:h-screen flex-auto justify-center lg:pt-0 pt-20 lg:items-center bg-blue-50'>
      <main className='flex gap-x-10 w-full px-10 lg:px-32 lg:flex-row flex-col gap-y-4 lg:gap-y-0 bg-blue-50 lg:bg-none'>
        <form onSubmit={handleSubmit} className='w-full lg:w-1/2'>
          <section className='flex flex-col gap-y-6'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-3xl font-bold text-primary-black'>
                Letter Generator
              </h1>
              <h5 className='text-sm mb-4 text-gray-quaternary'>
                Generate personalized and professional letters.
              </h5>
            </div>

            <div>
              <InputLabel className='text-secondary-black'>
                Describe your letter
                <sup className='text-red-500 font-medium'>*</sup>
              </InputLabel>
              <TextField
                value={prompt}
                error={isLimitExceeded}
                required
                placeholder='Write here'
                name='description'
                onChange={(e) => setPrompt(e.target.value)}
                rows={10}
                className='w-full p-2  border  rounded bg-white'
                multiline
              />
              <p
                className={`text-xs text-red-500 ml-2 ${
                  !isLimitExceeded && 'invisible'
                }`}
              >
                Character limit exceeded
              </p>
              <p
                className={`float-right ${
                  prompt?.length <= 300
                    ? 'text-gray-tertiary'
                    : 'text-red-500 font-medium'
                }`}
              >
                {prompt?.length > 0 ? `${prompt?.length} / 300` : '300'}
              </p>
            </div>

            <div className='flex gap-x-2'>
              <div className='w-1/2'>
                <InputLabel
                  id='demo-multiple-name-label'
                  className='text-secondary-black'
                >
                  Tone
                </InputLabel>
                <Select
                  labelId='demo-multiple-name-label'
                  id='demo-multiple-name'
                  value={tone}
                  onChange={handleToneChange}
                  MenuProps={MenuProps}
                  className='w-full bg-white'
                >
                  {names.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, tone, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className='w-1/2'>
                <InputLabel
                  id='demo-multiple-name-label'
                  className='text-secondary-black'
                >
                  Style
                </InputLabel>
                <Select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  defaultValue=''
                  labelId='demo-multiple-name-label'
                  id='demo-multiple-name'
                  MenuProps={MenuProps}
                  className='w-full bg-white'
                >
                  {letterStyle.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, style, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>

            <Button
              variant='contained'
              color='primary'
              className={`flex items-center justify-center ${
                isLimitExceeded && 'cursor-not-allowed'
              }`}
              type='submit'
              disabled={isLimitExceeded || loading}
            >
              {loading && (
                <div
                  className='w-5 h-5 mr-4 rounded-full animate-spin
                    border-4 border-solid border-t-transparent'
                ></div>
              )}
              {counter?.length > 0 ? 'Create more' : 'Generate'}
            </Button>
          </section>
        </form>
        <div className='border-t lg:border-r'></div>
        <div className='w-full lg:w-1/2'>
          <p
            className={`flex gap-x-2 mb-2 font-semibold ${
              loading && 'animate-pulse'
            }`}
          >
            {loading ? 'Generating...' : 'Results'}
            {counter > 0 && (
              <p className='bg-blue-200 text-xs text-primary px-2 flex items-center justify-center rounded-full'>
                {counter}
              </p>
            )}
          </p>
          <div className='border p-4 h-[33rem] rounded-lg bg-white flex flex-col'>
            {apiResponse && <strong>~Chat GPT~</strong>}
            <p
              className={`break-words overflow-y-auto whitespace-pre-line ${
                apiResponse?.length === 0 && 'text-gray-tertiary text-sm'
              }`}
            >
              {apiResponse ?? 'Results will be generated here...'}
            </p>
          </div>
          <div className='flex gap-x-4 mt-2 mb-4 lg:mb-0'>
            <Tooltip title='Save' color='black' arrow>
              <SaveIcon
                color='primary'
                onClick={() => {
                  if (apiResponse) {
                    handleSaveText(
                      apiResponse,
                      `Letter Generate ${counter}.txt`
                    );
                  }
                }}
              />
            </Tooltip>
            <Tooltip
              title={isCopied ? 'Copied Text' : 'Copy'}
              color='primary'
              arrow
            >
              <ContentCopyIcon color='primary' onClick={handleCopyText} />
            </Tooltip>
          </div>
        </div>
      </main>
    </div>
  );
}
