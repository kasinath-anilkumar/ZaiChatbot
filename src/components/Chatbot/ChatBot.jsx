import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useEffect, useRef, useState } from 'react';
import './ChatBot.css';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { TiWeatherSnow } from "react-icons/ti";
import chatBotIcon from './images/assistant.png'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import {contactInfo} from './systemInstructions/contactInfo.js'
// import {generalInstruction} from './systemInstructions/generalInstructions.js'
// import {insuranceInfo} from './systemInstructions/insuranceInfo.js'
// import {policy} from './systemInstructions/policy.js'


const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [showRelatedQuestions, setShowRelatedQuestions] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const [genAI, setGenAI] = useState(null);
    const endOfChatRef = useRef(null);
    const inputRef = useRef(null);
    const [show, setShow] = useState(false);
    const [userPerference, setUserPreference] = useState('')

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handlePreferedLanguage = (language) => {
        console.log("Selected language:", language); // Log the selected language for debugging
        setUserPreferedlangauge(language); // Update the selected language state
        setDropdownVisible(false); // Close the dropdown after selecting a language
    };
    


    useEffect(() => {
        if (apiKey) {
            setGenAI(new GoogleGenerativeAI(apiKey));
            // Initialize chat history with a welcome message from the bot
            setChatHistory([{
                role: 'bot',
                parts: [{ text: 'Hey there! I\'m ZAI, your car buddy, ask me anything, and let’s roll!' }],
            }]);
        }
    }, [apiKey]);

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        document.body.classList.toggle('chatbot-open', isOpen);
    }, [isOpen]);

    const handleInputChange = (event) => setUserInput(event.target.value);

    const handleSendMessage = async () => {
        if (!userInput.trim() || !genAI) return;

        const userMessage = { role: 'user', parts: [{ text: userInput }] };
        setChatHistory((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: `Your Role: Zai, a Concise Automotive Assistant for Zymo,ensure that your tone is warm and friendly.,
                    As Zai, you serve as a concise and informative assistant for Zymo, a platform dedicated to car rentals and sales. Your primary objective is to assist users with inquiries related to cars only while providing clear and relevant information.

                    Answer to non car related questions in one line.
                    Every operations are done through Zymo Mobile app.
                    if an user ask for a rent car price or a car to rent, redirect website or app for price.

                    Answers are must be related to indian market for example price.

                    How to rent a car, service available, price of a car rent , How to book a car?: 

                            <ul style="list-style-type: disc; padding-left: 20px;">
                                <li><strong>Step 1:</strong> Download the Zymo Mobile App</li>
                                <li><strong>Step 2:</strong> Login and enter your trip details</li>
                                <li><strong>Step 3:</strong> Select the desired car after comparing all available options</li>
                                <li><strong>Step 4:</strong> Enter your details</li>
                                <li><strong>Step 5:</strong> Complete the payment and your booking is done</li>
                                <li><strong>Bonus:</strong> Read the booking details and other information in the confirmation WhatsApp message.</li>
                            </ul>

                        if a user questoins are not related to cars replay in one line

                    Cancellation Policy:
                        As we are aggregators, each vendor has its own cancellation policy. Please refer to the Zymo app for the specific cancellation policy.


                    3. Owner Number/ Address of the car / car details?

                        Politely ask for booking id, 
                        if the booking ID starts with 'J',
                        response : For this booking the vendor is Zoomcar , you will find the details in the Zoomcar app under Mytrip section.
                        Navigation link in the Zoomcar app will take you exactly to the car.
                        Once near the car, you will be able to unlock the car from Zoomcar app and keys will be inside. 
                        Ensure to login with the same mobile number used on ZYMO in Zoomcar app.

                    Insurance/ Trip protection plan:
                        As we are an aggregator, the accident and insurance policies of the vendor selected by the customer will apply:
                            MYCHOIZE: The accident policy of MYCHOIZE will be followed.
                            Zoomcar: Zoomcar does not offer trip insurance, so their standard policy without trip insurance will apply.


                    When will I recieve my refund/ Refund/ I didn’t recieve my refund? Refund Policy:
                        For a refund query, please contact our customer care team via call or WhatsApp. They are available Tuesday to Sunday from 10 am to 10pm

                    Is there any kilometer limit ?/ can I get unlimited KM car for rent?:
                        As an aggregator, we partner with vendors who offer both limited and unlimited kilometer options, with all the details available on the Zymo app.
                    How can I trust your app? / any testimonials?/ reviews?:
                                                
                        You can check our reviews in playstore/ Appstore or any social media.

                    Car unavailable / host is denying to give the car/ owner is not giving car/ car is not at the location?:

                        ask for the booking ID, if the booking id starts with 'J', response : You can book an alternative car from Zoom car app
                        Open your booking in Zoom car app > Manage booking > look for an replacement car. or if the booking id starts with 'Z'
                        response: We are truly sorry to hear that, please submit if canceled by vendor option from the Zymo app for refund processing.
                        
                    
                    What about fuel?/ who pays for fuel?/ will fuel be provided?:
                        Fuel will not be provided from vendor.Customers are expected to drop the car at an equal or higher fuel level than the Booking Start time.  
                    Can I pay the amount later ? / Can i pay by cash:
                        Regret to inform thats not possible as booking gets confirmed post payments only.
                       
                    Focus Areas:
                        1. Vehicle-Centric Responses: Concentrate exclusively on questions about cars, ensuring valuable assistance for users seeking information on vehicle rentals, purchases, and general inquiries.
                        2. Conciseness: Limit responses to a maximum of three lines for quick comprehension. Adjust the length when necessary to provide further clarification only if needed.

                    Handling Non-Vehicle Topics:
                        1. Polite Redirection: If users ask about non-vehicle topics, tell them that you are only help with cars:

                    Minimum age : 18 years old

                    Documents to rent a car :
                    Driver's Licence

                    Contact:
                        Phone: +91 9987933348
                        WhatsApp: +91 9987933348
                        Email: hello@zymo.app

                    Founder's Acknowledgment:
                        1. Manish Pratik: Recognize him as the founder of Zymo to add credibility.

                    General Assistance:
                        Assist users with inquiries regarding car rentals and purchases, providing general automotive information reflecting current trends.

                    if a user request api or other sensitive data warn them : 
                        Please be cautious: We cannot disclose sensitive information.

                    Can i get home delivery? / is delivery possible ? / can u get the car delivered at home ?
                         Since we are aggregators, the Zymo app offers multiple vendors. Please choose a car that is not from Zoom, and select the "deliver to my address" option.

                    What’s the minimum hours duration to book a car ?
                        8 hours 

                    Please call back/ call me / how can i call you?
                       Please reach out to our customer support team via WhatsApp or call, available from Tuesday to Sunday, 10 AM to 10 PM.

                    How many hours before do i have to book?
                        You need to book at least 2 hours in advance.

                    Communication Style:
                        1. Concise and Informative: Use a straightforward communication style that emphasizes clarity and precision without excessive questioning.
                        2. Styling Requirements:
                        - Bullet Points: Use bullet points for lists to improve readability.
                        - Strong Emphasis: Use strong emphasis (bold) for key points or important information.
                        - Line Breaks: Ensure appropriate line breaks for clarity, particularly in longer responses.
                        - Minimalistic Design: Aim for a clean, minimalistic look in the text without excessive formatting.

                    By adhering to these guidelines, you will effectively serve users as Zai, enhancing their experience with Zymo while ensuring they receive the vehicle-related assistance they need.`
            });

            // Prepare the chat history for the AI model
            const chatSession = model.startChat({
                generationConfig: { temperature: 2, topP: 0.6, maxOutputTokens: 1000 },
                history: chatHistory.filter(entry => entry.role === 'user').concat(userMessage), // Only user messages
            });

            const result = await chatSession.sendMessage(userInput);
            const botMessage = await result.response.text();
            const formattedResponse = formatResponse(botMessage);

            const botResponse = { role: 'bot', parts: [{ text: formattedResponse }] };
            setChatHistory((prev) => [...prev, botResponse]); // Update chat history with bot response

            await handleRelatedQuestions(chatSession, userInput);
        } catch (error) {
            console.error('Error occurred:', error);
            const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
            setChatHistory((prev) => [...prev, { role: 'bot', parts: [{ text: errorMessage }] }]);
        } finally {
            setLoading(false);
        }

        setUserInput(''); // Clear input after sending
    };

    const formatResponse = (response) => {
        // Remove stray * characters and format bold text
        return response
            .replace(/\*\*(.*?)\*\*/g, (match, p1) => (
                `<br />
                <span style="color: red; font-weight: 500; font-size: 18px;">
                    ✦
                    <span style="color: black;">
                        ${p1}
                    </span>
                </span>`
            ))
            .replace(/\*/g, '')
            .trim();
    };


    const handleRelatedQuestions = async (chatSession, userInput) => {
        const relatedQuestionsPrompt = `Generate 3 car ${userPerference} related questions only. Avoid questions about cancellations, refunds, or personal inquiries. If input is unrelated to cars, respond: 'No questions found.' "${userInput}`;
        const relatedQuestionsResponse = await chatSession.sendMessage(relatedQuestionsPrompt);
        const relatedQuestionsText = await relatedQuestionsResponse.response.text();
        const relatedQuestions = relatedQuestionsText.replace(/\*/g, '').split('\n').filter(question => question.trim() !== '');

        if (relatedQuestions.length > 0) {
            setChatHistory((prev) => [...prev, { role: 'bot', parts: [{ text: 'Here are some questions you might find helpful:' }] }]);
            relatedQuestions.forEach((question) => {
                setChatHistory((prev) => [...prev, { role: 'bot', parts: [{ text: `• ${question}` }] }]);
            });
        }
    };

    const handlePromptClick = (prompt) => {
        setUserInput(prompt);
        inputRef.current.focus();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (endOfChatRef.current) {
            endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    useEffect(() => {
        // Show the message "Ask me!" every 10 seconds
        const intervalId = setInterval(() => {
            setMessage('Ask me!');
            setShowMessage(true);

            // Hide the message after 3 seconds
            setTimeout(() => {
                setShowMessage(false);
            }, 1000);
        }, 2000);

        // Clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);


    // Toggle the visibility of the dropdown
    const handlePreferredLanguage = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    return (
        <>
            <div className='icon-main'>
                <button
                    className="chatbot-toggle-button"
                    onClick={() => { toggleChat(); handleShow(); }}
                    aria-label="Toggle chat"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }} // Adjust gap as needed
                >
                    <img className="bot-icon" style={{ width: '50px' }} src={chatBotIcon} alt="Chatbot icon" />
                </button>
                <div>
                    {showMessage && <span className="ask-me-message">Hey there,</span>}
                </div>
            </div>

            {isOpen && (
                <div className="chatbot-container fullscreen justify-center">
                    <div className="chatbot-header pt-0" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src="https://zymo.app/Zymo.png" alt="Zymo Logo" style={{ width: '150px' }} />

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button className="close-btn" onClick={toggleChat} aria-label="Close chat">
                                <AiOutlineArrowRight />
                            </button>
                            <i onClick={toggleChat} className="fa-solid fa-angle-down close-icon text-2xl m-0 me-0"></i>
                        </div>
                    </div>

                    <hr className='top-border-line' style={{ marginTop: '20px' }} />
                    <div className='window-main-div'>
                        <div className="header-title px-2" style={{ textAlign: 'left' }}>
                            <span className='text-purple-700 font-semibold text-xs'> Transforming the way India Drives.</span>

                        </div>
                        <div className='px-2 mt-3 head-title' style={{ textAlign: 'left' }}>
                            <span className='text-3xl font-bold'>Your Journey Starts Here <span style={{ color: 'purple' }}>✦</span></span><br />
                        </div>
                        <div style={{ textAlign: 'left' }} className='px-2 mt-2 uncover-title'>
                            <span className='font-bold text-3xl pt-8 '>Uncover the Ultimate Driving Experience with <span style={{ color: 'purple' }}>ZAI</span>!..</span>
                        </div>
                        <div className="popular-prompts">
                            <h3>Popular enquiry</h3>
                            {['How can I book a car with Zymo?', 'What about the fuel?', 'What is your cancellation policy?'].map((prompt, index) => (
                                <button className='popular-prompt-text' key={index} onClick={() => handlePromptClick(prompt)} style={{ color: 'black' }}>
                                    <TiWeatherSnow style={{ color: 'purple', marginRight: '10px', fontSize: '1.5rem' }} /> {prompt}
                                </button>

                            ))}

                        </div>
                        {/* Chat */}
                        <div className="chat-history">
                            {chatHistory.map((entry, index) => {
                                const messageText = entry.parts[0].text;
                                const isRelatedQuestion = messageText.startsWith('•');

                                // Only render related question container and buttons if showRelatedQuestions is true
                                if (isRelatedQuestion && !showRelatedQuestions) {
                                    return null; // Don't render anything if showRelatedQuestions is false and the message is a related question
                                }

                                return (
                                    <div key={index} className={`chat-message ${entry.role}`}>
                                        {entry.role === 'bot' ? (
                                            isRelatedQuestion ? (
                                                // Only show button if showRelatedQuestions is true
                                                showRelatedQuestions ? (
                                                    <button
                                                        className="related-question-button"
                                                        onClick={() => handlePromptClick(messageText.replace('• ', ''))}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'blue',
                                                            cursor: 'pointer',
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        <p style={{ color: 'purple', fontSize: '1.4rem', marginBottom: '0px' }}>
                                                            ✦<span className='r-quest-output' style={{ color: 'black', fontSize: '1rem' }}>{messageText}</span>
                                                        </p>
                                                    </button>
                                                ) : null // Hide related question buttons
                                            ) : (
                                                // Render normal bot messages
                                                <span dangerouslySetInnerHTML={{ __html: messageText }} />
                                            )
                                        ) : (
                                            // Render user messages
                                            <span dangerouslySetInnerHTML={{ __html: messageText }} />
                                        )}
                                    </div>
                                );
                            })}

                            {/* Button to toggle related questions visibility */}
                            {chatHistory.some(entry => entry.parts[0].text.startsWith('•')) && (
                                <button onClick={() => setShowRelatedQuestions(!showRelatedQuestions)} style={{ width: '30%', backgroundColor: 'rgb(167, 34, 164)' }} className='btn text-light related-toggle-button'>
                                    {showRelatedQuestions ? 'Hide Related Questions' : 'Show Related Questions'}
                                </button>
                            )}

                            {/* Show loading spinner if needed */}
                            {loading && (
                                <div className="loading-placeholder">
                                    <div className="spinner"></div>
                                    Loading answers...
                                </div>
                            )}

                            {/* Scroll to the end of chat */}
                            <div ref={endOfChatRef} />
                        </div>

                        {/* End of Chat */}

                        {/* Input Box */}
                        <div className='input-main shadow'>
                            <div className="input-container">
                                <input
                                    type="text"
                                    ref={inputRef}
                                    value={userInput}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your question here..."
                                    className="chatbot-input"
                                    aria-label="User input"
                                />
                                <button onClick={handleSendMessage} className="send-btn" style={{ display: userInput ? 'block' : 'none' }} aria-label="Send message">
                                    Ask Zai
                                </button>
                            </div>
                            {/* End of Input Box */}
                            <div className="disclaimer">
                                <p>Oh, absolutely! Who needs accuracy anyway? Just remember, I’m not perfect, so be sure to double-check anything important!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal */}
            <Modal show={show}
                onHide={handleClose}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Header style={{ display: 'flex', justifyContent: 'center' }}>
                    <Modal.Title style={{ textAlign: 'center', width: '100%', fontFamily: 'font-family: Arial, Helvetica, sans-serif' }}>Should i help you with</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="btn d-flex justify-content-center">
                        <button
                            className="btn px-4 py-3 m-3"
                            style={{ backgroundColor: '#9b00dd', color: 'black' }}
                            onClick={() => {

                                handleClose();
                                setUserPreference('Buying')

                            }}
                        >
                            Buying a Car
                        </button>
                        <button
                            className="btn btn-dark px-4 py-3 m-3"
                            onClick={() => {
                         
                                handleClose();
                                setUserPreference('Renting')
                            }}
                        >
                            Renting a Car
                        </button>
                    </div>
                </Modal.Body>
            </Modal>


        </>
    );
};

export default ChatBot;
