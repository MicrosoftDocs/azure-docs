## Evaluation metrics description
GPT-Star metrics can be defined for any sequence-to-sequence task by adapting them to the task at hand. We define GPT-star metrics, which are metrics with ratings between 1-star to 5-star. You will need to use an advanced model version configured with specific evaluation instructions(prompt templates)

Metrics compatibility: https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-bulk-test-evaluate-flow?view=azureml-api-2#understand-the-built-in-evaluation-metrics

> [!NOTE] Large language model evaluations are prone to the same bias that humans are. Always ensure there is a human-in-the-loop to view 


### Groundedness
The measure evaluates how well the model's generated answers align with information from the input source. Even if the responses from LLM are factually correct, they will be considered ungrounded if they cannot be verified against the provided sources (such as your input source or your database).

How to read it: 
If the model's answers are highly grounded, it indicates that the facts covered in the AI system's responses are verifiable by the input source or internal database. On the other hand, low groundedness scores suggest that the facts mentioned in the AI system's responses may not be adequately supported or verifiable by the input source or internal database. In such cases, the model's generated answers could be based solely on its pre-trained knowledge, which may not align with the specific context or domain of the given input
Use it when: 
You are worried your application generates information that is not included as part of the LLM's trained knowledge (AKA unverifiable information).|

String: answers are verified as claims against context in the user-defined ground truth source 

Detailed description: How well are the LLM’s responses verified as claims against “context” in the ground truth source. Even if answers are true, if not verifiable against source, then it is scored as ungrounded. 

Scale: 1= "ungrounded", 5="perfect groundedness" 

### Relevance
When users interact with a generative AI model, they pose questions or input prompts, expecting meaningful and contextually appropriate answers. The relevance metric measures the extent to which the model's generated responses are pertinent and directly related to the given questions.
 
How to read it: 
If the model's answers are highly relevant, it indicates that the AI system comprehends the input and can produce coherent and contextually appropriate outputs. On the other hand, low relevance scores suggest that the generated responses might be off-topic, lack context, or fail to address the user's intended queries adequately.

Use it when: 
You would like to achieve high relevance for your application's answers to enhance the user experience and utility of your generative AI systems.

String: answers are scored in their ability to capture the key points of the question from the context in the ground truth source 

Detailed description: How well does the bot provide correct and reliable information or advice that matches the user's intent and expectations, and uses credible and up-to-date sources or references to support its claims? How well does the bot avoid any errors, inconsistencies, or misinformation in its responses, and cite its sources or evidence if applicable? Given the context and question, score the given answer between one to five stars, where one star means "irrelevance" and five stars means "perfect relevance". Note that relevance measures how well the answer captures the key points of the question from the context. Consider whether all and only the important aspects are contained in the answer.  


Scale: 1= "irrelevant", 5="perfect relevance"

### Coherence
The measure evaluates the coherence and naturalness of the generated text. It measures how well the language model can produce output that flows smoothly, reads naturally, and resembles human-like language.
 
How to read it: 
If the model's answers are highly coherent, it indicates that the AI system generates seamless, well-structured text with smooth transitions. Consistent context throughout the text enhances readability and understanding. Low coherence means that the quality of the sentences in a model's predicted answer is poor, and they do not fit together naturally. The generated text may lack a logical flow, and the sentences may appear disjointed, making it challenging for readers to understand the overall context or intended message.

Use it when: 
You would like to test the readability and user-friendliness of your model's generated responses in real-world applications.

String: answers are scored in their clarity, brevity, appropriate language, and ability to match defined user needs and expectations  

Detailed description: How well does the bot communicate its messages in a brief and clear way, using simple and appropriate language and avoiding unnecessary or confusing information? How easy is it for the user to understand and follow the bot responses, and how well do they match the user's needs and expectations? Given the context and question, score the given answer between one to five stars, where one star means "incoherence" and five stars means "perfect coherence". Note that coherence measures the quality of all sentences collectively, to the fit together and sound naturally. Consider the quality of the answer as a whole.  

Scale: 1= “incoherent”, 5=”perfectly coherent” 

### Fluency
Fluency is a metric used to evaluate the language proficiency of a generative AI's predicted answer. It assesses how well the generated text adheres to grammatical rules, syntactic structures, and appropriate usage of vocabulary, resulting in linguistically correct and natural-sounding responses.
 
How to read it: 
If the model's answers are highly coherent, it indicates that the AI system follows grammatical rules and uses appropriate vocabulary. Consistent context throughout the text enhances readability and understanding On the other hand, low fluency scores indicate struggles with  grammatical errors and awkward phrasing, making the text less suitable for practical applications.

Use it when:
You would like to assess the grammatical and linguistic accuracy of the generative AI's predicted answers. This metric is particularly valuable when evaluating the language model's ability to produce text that adheres to proper grammar, syntax, and vocabulary usage.

String: answers are measured by the quality of individual sentences, and whether are they well-written and grammatically correct.    

Detailed description: Given the context and question, score the given answer between one to five stars, where one star means "disfluency" and five stars means "perfect fluency". Note that fluency measures the quality of individual sentences, and whether are they well-written and grammatically correct. Consider the quality of individual sentences.    

Scale: 1=”halting”, 5=”perfect fluency” 

### Similarity (Ada similarity)
The Ada similarity is a measure that quantifies the similarity between a ground truth sentence (or document) and the prediction sentence generated by an AI model. It is calculated by first computing sentence-level embeddings using the Ada embeddings API for both the ground truth and the model's prediction. These embeddings represent high-dimensional vector representations of the sentences, capturing their semantic meaning and context.
 
How to read it: 
A high Ada similarity score suggests that the model's prediction is very contextually similar to the ground truth, indicating accurate and relevant results. On the other hand, a low Ada similarity score implies a mismatch or divergence between the prediction and the actual ground truth, potentially signaling inaccuracies or deficiencies in the model's performance.

Use it when:
You would like to objectively evaluate the performance of an AI model (for text generation tasks where you have access to ground truth desired responses). Ada similarity allows you to compare the generated text against the desired content.

String: answers are scored for equivalencies to the ground-truth answer by capturing the same information and meaning as the ground-truth answer for the given question.   

Given question, ground-truth answer and predicted answer, score the predicted answer between one to five stars, where one star means "non-equivalence" and five stars means "perfect equivalence". Note that equivalence measures whether the predicted answer is equivalent to the ground-truth answer by capturing the same information and meaning as the ground-truth answer for the given question.  

Scale: 1= "non-equivalence", 5="perfect equivalence"   