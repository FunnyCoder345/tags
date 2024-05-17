import {useStore} from '../store/store';

export const analyzeImageWithOpenAI = async () => {
  try {
    useStore.getState().setWaitLabels(true);
    useStore.getState().setWaitLabels(false);
    return ['table', 'flower', 'colors'];
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error);
    throw error;
  }
};

//sk-proj-HnD6MVwMadWUrjUkEl1dT3BlbkFJxNYTp9lsbcRPhvnXXplX
