// import { useTheme } from "@emotion/react";
import { useTheme } from '@mui/material/styles';
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import { useState } from 'react';
import OpenAI from 'openai';

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
  '😁 Authoritative',
  '😁 Humorous',
  '😁 Empathetic',
  '😁 Persuasive',
  '🤓 Technical',
  '🤓 Creative',
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
  const [tone, setTone] = useState('🙂 Normal');
  const [style, setStyle] = useState('🙂 Conversational');

  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true,
  });

  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const isLimitExceeded = prompt?.length > 300;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // try {
    //   const result = await openai.chat.completions.create({
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'user', content: `${prompt} in ${tone?.split(' ')?.[1]} tone and ${
    //   style?.split(' ')?.[1]
    // } style.` }],
    //   });
    //   setApiResponse(result?.choices?.[0]?.message?.content);
    // } catch (e) {
    //   console.log('error', e);
    //   setApiResponse('Something is going wrong, Please try again.');
    // }
    console.log(
      'prompt ==>',
      `${prompt} in ${tone?.split(' ')?.[1]} tone and ${
        style?.split(' ')?.[1]
      } style.`
    );
    setLoading(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTone(value);
  };

  return (
    <div className='flex h-screen flex-auto justify-center items-center bg-blue-50'>
      <main className='flex gap-x-10 w-full px-32'>
        <form onSubmit={handleSubmit} className='w-1/2'>
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
                // helperText={isLimitExceeded && 'Character limit exceeded'}
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
                  onChange={handleChange}
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
              className={`${isLimitExceeded && 'cursor-not-allowed'}`}
              type='submit'
              disabled={isLimitExceeded}
            >
              Create more
            </Button>
          </section>
        </form>
        <div className='border-r'></div>
        <div className='w-1/2'>
          <p className='flex gap-x-2 mb-2 font-semibold'>
            {loading ? 'Generating...' : 'Results'}
            <p className='bg-blue-200 text-xs text-primary px-2 flex items-center justify-center rounded-full'>
              1
            </p>
          </p>
          <div className='border p-4 h-fit rounded-lg bg-white flex justify-center'>
            {/* {apiResponse && ( */}
            <p className='break-words h-[33.5rem] overflow-y-auto'>
              <strong>Chat GPT :</strong>
              {/* {apiResponse} */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            {/* )} */}
          </div>
        </div>
      </main>
    </div>
  );
}
