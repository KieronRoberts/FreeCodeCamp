document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  var quoteTextElement = document.getElementById('quote-text');
  var quoteAuthorElement = document.getElementById('quote-author');
  var newQuoteButton = document.getElementById('new-quote');

  // Array of quotes
  var quotes = [
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "If life were predictable it would cease to be life, and be without flavor.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon"
    },
    {
      text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
      author: "Mother Teresa"
    }
  ];

  // Generate a random quote
  function generateRandomQuote() {
    var randomIndex = Math.floor(Math.random() * quotes.length);
    var quote = quotes[randomIndex];
    
    // Update the quote text and author
    quoteTextElement.textContent = quote.text;
    quoteAuthorElement.textContent = "- " + quote.author;
  }

  // Generate a random quote on initial load
  generateRandomQuote();

  // Generate a random quote on button click
  newQuoteButton.addEventListener('click', generateRandomQuote);
});
