import { useState, useRef } from "react";
import { FaVolumeUp, FaMicrophone, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Box, Button, Container, Text, VStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex, Spacer } from "@chakra-ui/react";

const flashcards = [
  { id: 1, word: "cat", phonics: "c-a-t" },
  { id: 2, word: "dog", phonics: "d-o-g" },
  { id: 3, word: "bat", phonics: "b-a-t" },
  // Add more flashcards as needed
];

const speakWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  speechSynthesis.speak(utterance);
};

const Index = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [pronunciationMatch, setPronunciationMatch] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleStartRecording = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        audioChunksRef.current = [];
        comparePronunciation(audioBlob, currentCard.word);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const comparePronunciation = async (audioBlob, word) => {
    const recognizer = new window.webkitSpeechRecognition();
    recognizer.lang = 'en-US';
    recognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (transcript === word.toLowerCase()) {
        setPronunciationMatch(true);
      } else {
        setPronunciationMatch(false);
      }
    };
    recognizer.onerror = () => {
      setPronunciationMatch(false);
    };
    recognizer.start();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const currentCard = flashcards[currentCardIndex];
  const highlightedWord = currentCard.word.split("").map((letter, index) => (
    <Text as="span" key={index} color={index < sliderValue ? "teal.500" : "black"}>
      {letter}
    </Text>
  ));

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Flex direction="column" align="center" width="100%">
          <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" textAlign="center" display="flex" alignItems="center" justifyContent="center">
            <FaVolumeUp size="24px" cursor="pointer" onClick={() => speakWord(currentCard.word)} />
          </Box>
          <Spacer />
          <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" textAlign="center" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="3xl" mb={2} mr={2}>{highlightedWord}</Text>
            <Text fontSize="xl" color="gray.500">{currentCard.phonics}</Text>
          </Box>
          <Spacer />
          <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" textAlign="center" display="flex" alignItems="center" justifyContent="center">
            <FaMicrophone size="24px" cursor="pointer" color={isRecording ? "red" : "black"} onClick={handleStartRecording} />
          </Box>
          {pronunciationMatch !== null && (
            <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" textAlign="center" display="flex" alignItems="center" justifyContent="center">
              {pronunciationMatch ? (
                <FaCheckCircle size="24px" color="green" />
              ) : (
                <FaTimesCircle size="24px" color="red" />
              )}
            </Box>
          )}
        </Flex>
        <Slider aria-label="slider-ex-1" defaultValue={0} min={0} max={currentCard.word.length} onChange={handleSliderChange}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Button colorScheme="teal" onClick={handleNextCard}>Next</Button>
        {audioURL && (
          <audio controls src={audioURL} />
        )}
      </VStack>
    </Container>
  );
};

export default Index;