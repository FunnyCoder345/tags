import {OPENAI_KEY} from '@env';
import {useStore} from '../store/store';

export const analyzeImageWithOpenAI = async (uri: string) => {
  try {
    useStore.getState().setWaitLabels(true);
    console.log('Waiting for analysis result...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: `Recognizes up to 3 major objects that are in focus in this image, and make a list of labels for them. The labels should not be longer than 20 characters. can you send me result in this format 'string,string,string', if here is bad picture or you can't detekt nothing in picture send me words bad pic, please`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${uri}`,
                },
              },
            ],
          },
        ],
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ['\n'],
      }),
    });

    const jsonResponse = await response.json();

    // Log the response for debugging
    const tags = jsonResponse.choices[0].message.content.split(',');
    useStore.getState().setLabels(tags);
    useStore.getState().setWaitLabels(false);
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error);
    throw error;
  }
  return;
};
