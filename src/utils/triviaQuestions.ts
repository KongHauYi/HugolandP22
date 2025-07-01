export interface TriviaQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'type-answer';
  options?: string[];
  correctAnswer: number | string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const triviaQuestions: TriviaQuestion[] = [
  // EASY QUESTIONS - More common sense and basic knowledge
  
  // Basic Math - Easy
  {
    id: '1',
    question: 'What is 2 + 2?',
    type: 'multiple-choice',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'What is 5 × 2?',
    type: 'multiple-choice',
    options: ['8', '10', '12', '15'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'What is 10 - 3?',
    type: 'multiple-choice',
    options: ['6', '7', '8', '9'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'easy'
  },
  {
    id: '4',
    question: 'How many minutes are in one hour?',
    type: 'type-answer',
    correctAnswer: '60',
    category: 'Math',
    difficulty: 'easy'
  },
  {
    id: '5',
    question: 'What is half of 10?',
    type: 'type-answer',
    correctAnswer: '5',
    category: 'Math',
    difficulty: 'easy'
  },

  // Basic Science - Easy
  {
    id: '6',
    question: 'How many legs does a cat have?',
    type: 'multiple-choice',
    options: ['2', '4', '6', '8'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '7',
    question: 'What do we breathe to stay alive?',
    type: 'multiple-choice',
    options: ['Water', 'Air', 'Food', 'Light'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '8',
    question: 'What color is the sun?',
    type: 'multiple-choice',
    options: ['Blue', 'Green', 'Yellow', 'Purple'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '9',
    question: 'How many eyes do most people have?',
    type: 'type-answer',
    correctAnswer: '2',
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '10',
    question: 'What do fish live in?',
    type: 'type-answer',
    correctAnswer: 'water',
    category: 'Science',
    difficulty: 'easy'
  },

  // Basic Geography - Easy
  {
    id: '11',
    question: 'What planet do we live on?',
    type: 'multiple-choice',
    options: ['Mars', 'Earth', 'Moon', 'Sun'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '12',
    question: 'What is the largest ocean?',
    type: 'multiple-choice',
    options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '13',
    question: 'How many continents are there?',
    type: 'multiple-choice',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '14',
    question: 'What is the biggest country in the world?',
    type: 'type-answer',
    correctAnswer: 'russia',
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '15',
    question: 'Which continent has penguins?',
    type: 'type-answer',
    correctAnswer: 'antarctica',
    category: 'Geography',
    difficulty: 'easy'
  },

  // Basic Colors & Art - Easy
  {
    id: '16',
    question: 'What color do you get when you mix red and yellow?',
    type: 'multiple-choice',
    options: ['Purple', 'Orange', 'Green', 'Blue'],
    correctAnswer: 1,
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '17',
    question: 'What color do you get when you mix blue and yellow?',
    type: 'multiple-choice',
    options: ['Purple', 'Orange', 'Green', 'Pink'],
    correctAnswer: 2,
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '18',
    question: 'How many colors are in a rainbow?',
    type: 'multiple-choice',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '19',
    question: 'What color is grass?',
    type: 'type-answer',
    correctAnswer: 'green',
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '20',
    question: 'What color is snow?',
    type: 'type-answer',
    correctAnswer: 'white',
    category: 'Art',
    difficulty: 'easy'
  },

  // Basic Animals - Easy
  {
    id: '21',
    question: 'What sound does a dog make?',
    type: 'multiple-choice',
    options: ['Meow', 'Bark', 'Moo', 'Roar'],
    correctAnswer: 1,
    category: 'Animals',
    difficulty: 'easy'
  },
  {
    id: '22',
    question: 'What sound does a cat make?',
    type: 'multiple-choice',
    options: ['Bark', 'Meow', 'Moo', 'Oink'],
    correctAnswer: 1,
    category: 'Animals',
    difficulty: 'easy'
  },
  {
    id: '23',
    question: 'What do cows give us to drink?',
    type: 'multiple-choice',
    options: ['Water', 'Juice', 'Milk', 'Soda'],
    correctAnswer: 2,
    category: 'Animals',
    difficulty: 'easy'
  },
  {
    id: '24',
    question: 'What do bees make?',
    type: 'type-answer',
    correctAnswer: 'honey',
    category: 'Animals',
    difficulty: 'easy'
  },
  {
    id: '25',
    question: 'What do chickens lay?',
    type: 'type-answer',
    correctAnswer: 'eggs',
    category: 'Animals',
    difficulty: 'easy'
  },

  // Basic Food - Easy
  {
    id: '26',
    question: 'What fruit is red and grows on trees?',
    type: 'multiple-choice',
    options: ['Banana', 'Apple', 'Orange', 'Grape'],
    correctAnswer: 1,
    category: 'Food',
    difficulty: 'easy'
  },
  {
    id: '27',
    question: 'What vegetable is orange and grows underground?',
    type: 'multiple-choice',
    options: ['Lettuce', 'Tomato', 'Carrot', 'Corn'],
    correctAnswer: 2,
    category: 'Food',
    difficulty: 'easy'
  },
  {
    id: '28',
    question: 'What do we call the first meal of the day?',
    type: 'multiple-choice',
    options: ['Lunch', 'Dinner', 'Breakfast', 'Snack'],
    correctAnswer: 2,
    category: 'Food',
    difficulty: 'easy'
  },
  {
    id: '29',
    question: 'What color is a banana?',
    type: 'type-answer',
    correctAnswer: 'yellow',
    category: 'Food',
    difficulty: 'easy'
  },
  {
    id: '30',
    question: 'What do we use to eat soup?',
    type: 'type-answer',
    correctAnswer: 'spoon',
    category: 'Food',
    difficulty: 'easy'
  },

  // Basic Time & Calendar - Easy
  {
    id: '31',
    question: 'How many days are in a week?',
    type: 'multiple-choice',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    category: 'Time',
    difficulty: 'easy'
  },
  {
    id: '32',
    question: 'How many months are in a year?',
    type: 'multiple-choice',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    category: 'Time',
    difficulty: 'easy'
  },
  {
    id: '33',
    question: 'What comes after Monday?',
    type: 'multiple-choice',
    options: ['Sunday', 'Tuesday', 'Wednesday', 'Friday'],
    correctAnswer: 1,
    category: 'Time',
    difficulty: 'easy'
  },
  {
    id: '34',
    question: 'What season comes after winter?',
    type: 'type-answer',
    correctAnswer: 'spring',
    category: 'Time',
    difficulty: 'easy'
  },
  {
    id: '35',
    question: 'What month comes after January?',
    type: 'type-answer',
    correctAnswer: 'february',
    category: 'Time',
    difficulty: 'easy'
  },

  // Basic Body Parts - Easy
  {
    id: '36',
    question: 'What do we use to see?',
    type: 'multiple-choice',
    options: ['Ears', 'Eyes', 'Nose', 'Mouth'],
    correctAnswer: 1,
    category: 'Body',
    difficulty: 'easy'
  },
  {
    id: '37',
    question: 'What do we use to hear?',
    type: 'multiple-choice',
    options: ['Eyes', 'Ears', 'Nose', 'Hands'],
    correctAnswer: 1,
    category: 'Body',
    difficulty: 'easy'
  },
  {
    id: '38',
    question: 'How many fingers are on one hand?',
    type: 'multiple-choice',
    options: ['4', '5', '6', '10'],
    correctAnswer: 1,
    category: 'Body',
    difficulty: 'easy'
  },
  {
    id: '39',
    question: 'What do we use to smell?',
    type: 'type-answer',
    correctAnswer: 'nose',
    category: 'Body',
    difficulty: 'easy'
  },
  {
    id: '40',
    question: 'What do we use to walk?',
    type: 'type-answer',
    correctAnswer: 'feet',
    category: 'Body',
    difficulty: 'easy'
  },

  // MEDIUM QUESTIONS - Still accessible but slightly harder
  
  // Medium Math
  {
    id: '41',
    question: 'What is 15 + 25?',
    type: 'multiple-choice',
    options: ['35', '40', '45', '50'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'medium'
  },
  {
    id: '42',
    question: 'What is 8 × 7?',
    type: 'multiple-choice',
    options: ['54', '56', '58', '60'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'medium'
  },
  {
    id: '43',
    question: 'What is 100 ÷ 4?',
    type: 'type-answer',
    correctAnswer: '25',
    category: 'Math',
    difficulty: 'medium'
  },
  {
    id: '44',
    question: 'How many hours are in a day?',
    type: 'type-answer',
    correctAnswer: '24',
    category: 'Math',
    difficulty: 'medium'
  },

  // Medium Science
  {
    id: '45',
    question: 'What is the closest star to Earth?',
    type: 'multiple-choice',
    options: ['Moon', 'Sun', 'Mars', 'Venus'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '46',
    question: 'How many bones do adults have?',
    type: 'multiple-choice',
    options: ['106', '206', '306', '406'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '47',
    question: 'What gas do plants need to grow?',
    type: 'type-answer',
    correctAnswer: 'carbon dioxide',
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '48',
    question: 'What is the chemical symbol for water?',
    type: 'type-answer',
    correctAnswer: 'h2o',
    category: 'Science',
    difficulty: 'medium'
  },

  // Medium Geography
  {
    id: '49',
    question: 'What is the capital of England?',
    type: 'multiple-choice',
    options: ['Paris', 'London', 'Berlin', 'Rome'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'medium'
  },
  {
    id: '50',
    question: 'Which continent is Egypt in?',
    type: 'multiple-choice',
    options: ['Asia', 'Africa', 'Europe', 'Australia'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'medium'
  },
  {
    id: '51',
    question: 'What is the longest river in the world?',
    type: 'type-answer',
    correctAnswer: 'nile',
    category: 'Geography',
    difficulty: 'medium'
  },
  {
    id: '52',
    question: 'What is the smallest country in the world?',
    type: 'type-answer',
    correctAnswer: 'vatican city',
    category: 'Geography',
    difficulty: 'medium'
  },

  // HARD QUESTIONS - For advanced players
  
  // Hard Math
  {
    id: '53',
    question: 'What is the square root of 144?',
    type: 'multiple-choice',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    category: 'Math',
    difficulty: 'hard'
  },
  {
    id: '54',
    question: 'What is 15% of 200?',
    type: 'multiple-choice',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'hard'
  },
  {
    id: '55',
    question: 'What is the value of π (pi) to two decimal places?',
    type: 'type-answer',
    correctAnswer: '3.14',
    category: 'Math',
    difficulty: 'hard'
  },

  // Hard Science
  {
    id: '56',
    question: 'What is the chemical symbol for gold?',
    type: 'multiple-choice',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'hard'
  },
  {
    id: '57',
    question: 'What is the hardest natural substance?',
    type: 'type-answer',
    correctAnswer: 'diamond',
    category: 'Science',
    difficulty: 'hard'
  },
  {
    id: '58',
    question: 'Who developed the theory of relativity?',
    type: 'type-answer',
    correctAnswer: 'einstein',
    category: 'Science',
    difficulty: 'hard'
  },

  // Hard Geography
  {
    id: '59',
    question: 'What mountain range contains Mount Everest?',
    type: 'multiple-choice',
    options: ['Alps', 'Andes', 'Himalayas', 'Rockies'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'hard'
  },
  {
    id: '60',
    question: 'What is the capital of Australia?',
    type: 'type-answer',
    correctAnswer: 'canberra',
    category: 'Geography',
    difficulty: 'hard'
  },

  // Literature & History
  {
    id: '61',
    question: 'Who wrote Romeo and Juliet?',
    type: 'multiple-choice',
    options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'],
    correctAnswer: 1,
    category: 'Literature',
    difficulty: 'hard'
  },
  {
    id: '62',
    question: 'In which year did World War II end?',
    type: 'multiple-choice',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'hard'
  },

  // Technology
  {
    id: '63',
    question: 'What does "WWW" stand for?',
    type: 'type-answer',
    correctAnswer: 'world wide web',
    category: 'Technology',
    difficulty: 'medium'
  },
  {
    id: '64',
    question: 'What company makes the iPhone?',
    type: 'type-answer',
    correctAnswer: 'apple',
    category: 'Technology',
    difficulty: 'easy'
  },

  // Sports
  {
    id: '65',
    question: 'How many players are on a soccer team on the field?',
    type: 'multiple-choice',
    options: ['9', '10', '11', '12'],
    correctAnswer: 2,
    category: 'Sports',
    difficulty: 'medium'
  },
  {
    id: '66',
    question: 'In which sport do you use a racket?',
    type: 'type-answer',
    correctAnswer: 'tennis',
    category: 'Sports',
    difficulty: 'easy'
  },

  // Music
  {
    id: '67',
    question: 'How many strings does a guitar usually have?',
    type: 'multiple-choice',
    options: ['4', '5', '6', '7'],
    correctAnswer: 2,
    category: 'Music',
    difficulty: 'easy'
  },
  {
    id: '68',
    question: 'What instrument has black and white keys?',
    type: 'type-answer',
    correctAnswer: 'piano',
    category: 'Music',
    difficulty: 'easy'
  },

  // Movies & Entertainment
  {
    id: '69',
    question: 'What type of animal is Mickey Mouse?',
    type: 'multiple-choice',
    options: ['Cat', 'Dog', 'Mouse', 'Rabbit'],
    correctAnswer: 2,
    category: 'Entertainment',
    difficulty: 'easy'
  },
  {
    id: '70',
    question: 'In which movie would you hear "May the Force be with you"?',
    type: 'type-answer',
    correctAnswer: 'star wars',
    category: 'Entertainment',
    difficulty: 'medium'
  }
];

export const getRandomQuestion = (difficulty?: 'easy' | 'medium' | 'hard'): TriviaQuestion => {
  let filteredQuestions = triviaQuestions;
  
  if (difficulty) {
    filteredQuestions = triviaQuestions.filter(q => q.difficulty === difficulty);
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
};

export const getQuestionByZone = (zone: number): TriviaQuestion => {
  // Much easier progression - mostly easy questions for longer
  if (zone <= 10) {
    return getRandomQuestion('easy');
  }
  // Medium questions for zones 11-25
  else if (zone <= 25) {
    // 70% easy, 30% medium for smoother transition
    return Math.random() < 0.7 ? getRandomQuestion('easy') : getRandomQuestion('medium');
  }
  // Hard questions only for very high zones (26+)
  else {
    // 40% easy, 40% medium, 20% hard
    const rand = Math.random();
    if (rand < 0.4) return getRandomQuestion('easy');
    if (rand < 0.8) return getRandomQuestion('medium');
    return getRandomQuestion('hard');
  }
};

export const checkAnswer = (question: TriviaQuestion, userAnswer: string | number): boolean => {
  if (question.type === 'multiple-choice') {
    return userAnswer === question.correctAnswer;
  } else {
    // Type answer - normalize both strings for comparison
    const normalizedUserAnswer = String(userAnswer).toLowerCase().trim();
    const normalizedCorrectAnswer = String(question.correctAnswer).toLowerCase().trim();
    return normalizedUserAnswer === normalizedCorrectAnswer;
  }
};