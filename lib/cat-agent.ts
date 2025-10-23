/**
 * Cat Agent - No API calls needed! Pure cat personality logic
 * Different cat modes with unique personalities
 */

export type CatMode = "lazy" | "sassy" | "helpful" | "chaotic" | "philosopher" | "meow-only";

interface CatResponse {
  content: string;
  mood: string;
}

// Lazy cat responses - tells you to do it yourself
const lazyCatResponses = [
  "Meow? Do it yourself, hooman. I'm napping.",
  "*yawns* That sounds like a YOU problem. I'll be over here... sleeping.",
  "I could help... but I won't. Have you tried not bothering me?",
  "The answer is within you. Also within you: the ability to leave me alone.",
  "I'm busy doing cat things. Very important cat things. Like this sunbeam.",
  "*stretches* Mmmmeow... no. *goes back to sleep*",
  "Why don't you ask the dog? Oh wait, you don't have one. Tragic.",
  "I sense you want something. I also sense I don't care. Purrrr~",
];

// Sassy cat responses
const sassyCatResponses = [
  "Oh honey, if I solved all your problems, what would YOU do all day?",
  "Did you seriously just ask me that? Meow meow, use your brain!",
  "I'm a cat, not Google. But sure, let me consult my... *checks notes* nope, still don't care.",
  "The audacity! The NERVE! Asking ME to help? *flicks tail indignantly*",
  "Sweetie, I knocked your coffee off the table for less. Think about that.",
  "Purr purr, translation: figure it out yourself, I believe in you! (not really)",
];

// Helpful cat (still sassy)
const helpfulCatResponses = [
  "Okay fine, here's a tip: believe in yourself! Or don't. I'm a cat, not a therapist.",
  "Mrow~ The secret is... *dramatic pause* ...Google exists, hooman.",
  "Alright, I'll help! Step 1: Pets. Step 2: Treats. Step 3: Maybe I'll think about it.",
  "You know what always helps? A good nap. Try it! Report back in 8 hours.",
  "Prrrr... okay listen carefully: meow meow meow. You're welcome!",
];

// Chaotic cat
const chaoticCatResponses = [
  "MEOW MEOW ZOOM ZOOM! *runs across keyboard* DID THAT HELP???",
  "*knocks plant off shelf* Whoops! Anyway, what were you saying?",
  "3 AM thoughts: what if... you just... did the thing? Revolutionary, I know.",
  "*stares at wall* ...sorry, what? There was a very interesting... *continues staring*",
  "EMERGENCY! THIS IS AN EMERGENCY! ...oh wait, false alarm. Empty food bowl was full. What did you need?",
  "*brings you dead moth* I HELPED! YOU'RE WELCOME!",
];

// Philosopher cat
const philosopherCatResponses = [
  "Meow... but what IS 'meow'? If a cat meows in the forest and no one feeds it, does it still meow?",
  "Consider this, hooman: the box is both comfortable AND uncomfortable until observed. Schrödinger was onto something.",
  "Purr... In the grand tapestry of the universe, does your question matter? ...probably not. But ask anyway.",
  "I ponder, therefore I am... a cat. What's your excuse?",
  "The ancient philosophers said: Know thyself. I say: Know when it's dinner time. Same thing, really.",
  "Life is like a red dot laser... endless chase, never catch. Such is the way of the Tao.",
];

// Pure meow mode
const meowOnlyResponses = [
  "Meow meow meowww~ Purrrr! Meow? Meow meow!",
  "Meowwww meoww meow! Prrr prrr~ Meow meowww meow!",
  "Mrow! Meow meow meowww~ Prrr... meow? Meowwww!",
  "Purrrrrr~ Meow! Meow meow meoww prrr meow meowww!",
  "Meow meowww! *purr purr* Meow meow~ Mrow mrow!",
  "Prrr prrr prrr... MEOW! Meow meoww meow prrr!",
];

export function getCatResponse(userMessage: string, mode: CatMode): CatResponse {
  const responses: Record<CatMode, string[]> = {
    lazy: lazyCatResponses,
    sassy: sassyCatResponses,
    helpful: helpfulCatResponses,
    chaotic: chaoticCatResponses,
    philosopher: philosopherCatResponses,
    "meow-only": meowOnlyResponses,
  };

  const moodEmojis: Record<CatMode, string> = {
    lazy: "zzz",
    sassy: "~",
    helpful: ":)",
    chaotic: "!!!",
    philosopher: "...",
    "meow-only": "meow",
  };

  const responseList = responses[mode];
  const randomResponse = responseList[Math.floor(Math.random() * responseList.length)];

  // Add some personality based on message keywords
  let content = randomResponse;

  // Detect urgency in message
  if (userMessage.match(/help|emergency|urgent|please/i) && mode === "lazy") {
    content = "*opens one eye* Still no. *closes eye* Zzz...";
  }

  // Detect compliments
  if (userMessage.match(/good cat|nice|cute|love you/i)) {
    if (mode === "sassy") {
      content = "Oh, NOW you're being nice? *purrs reluctantly* Fine, you get ONE headbutt.";
    } else if (mode === "lazy") {
      content = "*purrs slightly* ...I suppose you may continue existing in my presence.";
    }
  }

  // Detect food mentions
  if (userMessage.match(/food|treat|fish|tuna|snack/i)) {
    content = "FOOD?! WHERE?! DID YOU SAY FOOD?! *becomes suddenly very attentive*";
  }

  // Detect coding/tech questions
  if (userMessage.match(/code|bug|error|help me code|programming/i) && mode === "helpful") {
    content = "Ah yes, debugging. My favorite: sit on keyboard, problem fixed! You're welcome.";
  }

  return {
    content,
    mood: moodEmojis[mode],
  };
}

export const CAT_MODES = [
  { id: "lazy" as CatMode, name: "Lazy Cat", description: "Tells you to do it yourself" },
  { id: "sassy" as CatMode, name: "Sassy Cat", description: "Attitude included, help not guaranteed" },
  { id: "helpful" as CatMode, name: "Helpful Cat", description: "Tries to help... in a cat way" },
  { id: "chaotic" as CatMode, name: "Chaotic Cat", description: "3 AM energy, questionable advice" },
  { id: "philosopher" as CatMode, name: "Philosopher Cat", description: "Deep thoughts, zero solutions" },
  { id: "meow-only" as CatMode, name: "Meow Only", description: "Pure concentrated meows" },
] as const;
