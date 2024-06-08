import { useState, useRef } from "react";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa";
import { Box, Button, Container, Text, VStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";

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
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const currentCard = flashcards[currentCardIndex];
  const highlightedWord = currentCard.word.split("").map((letter, index) => (
    <Text as="span" key={index} color={index < sliderValue ? "teal.500" : "black"}>
      {letter}
    </Text>
  ));

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" textAlign="center" display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="3xl" mb={2} mr={2}>{highlightedWord}</Text>
          <FaVolumeUp size="24px" cursor="pointer" onClick={() => speakWord(currentCard.word)} />
          <FaMicrophone size="24px" cursor="pointer" color={isRecording ? "red" : "black"} onClick={handleStartRecording} />
          <Text fontSize="xl" color="gray.500">{currentCard.phonics}</Text>
        </Box>
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