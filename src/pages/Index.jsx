import { useState } from "react";
import { Box, Button, Container, Text, VStack } from "@chakra-ui/react";

const flashcards = [
  { id: 1, word: "cat", phonics: "c-a-t" },
  { id: 2, word: "dog", phonics: "d-o-g" },
  { id: 3, word: "bat", phonics: "b-a-t" },
  // Add more flashcards as needed
];

const Index = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" textAlign="center">
          <Text fontSize="3xl" mb={2}>{currentCard.word}</Text>
          <Text fontSize="xl" color="gray.500">{currentCard.phonics}</Text>
        </Box>
        <Button colorScheme="teal" onClick={handleNextCard}>Next</Button>
      </VStack>
    </Container>
  );
};

export default Index;