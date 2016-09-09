<properties
   pageTitle="The 5 data science questions - Data Science for Beginners | Microsoft Azure"
   description="Get a quick introduction to data science from Data Science for Beginners, five short videos that start with The 5 Questions Data Science Answers."
   keywords="doing data science,introduction to data science,data science for beginners, types of questions,data science questions, data science algorithms"
   services="machine-learning"
   documentationCenter="na"
   authors="brohrer-ms"
   manager="paulettm"
   editor="cjgronlund"/>

<tags
   ms.service="machine-learning"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/24/2016"
   ms.author="cgronlun;brohrer;garye"/>

# Data Science for Beginners video 1: The 5 questions data science answers

Get a quick introduction to data science from *Data Science for Beginners* in five short videos. This video series is helpful if you're interested in doing data science - or work with people who do data science - and you want to start with some basic concepts.

This first video is about the kinds of questions that data science can answer. Data science predicts answers to questions using a number or category. To get the most out of the series, watch them in order. [Go to the list of videos](#other-videos-in-this-series)

> [AZURE.VIDEO data-science-for-beginners-series-the-5-questions-data-science-answers]

## Other videos in this series

*Data Science for Beginners* is a quick introduction to data science taking about 25 minutes total. Check out the other four videos:

  * Video 1: The 5 questions data science answers
  * Video 2: [Is your data ready for data science?](machine-learning-data-science-for-beginners-is-your-data-ready-for-data-science.md) *(4 min 56 sec)*
  * Video 3: [Ask a question you can answer with data](machine-learning-data-science-for-beginners-ask-a-question-you-can-answer-with-data.md) *(4 min 17 sec)*
  * Video 4: [Predict an answer with a simple model](machine-learning-data-science-for-beginners-predict-an-answer-with-a-simple-model.md) *(7 min 42 sec)*
  * Video 5: [Copy other people's work to do data science](machine-learning-data-science-for-beginners-copy-other-peoples-work-to-do-data-science.md) *(3 min 18 sec)*

## Transcript: The 5 questions data science answers

Hi! Welcome to the video series *Data Science for Beginners*.

Data Science can be intimidating, so I'll introduce the basics here without any equations or computer programming jargon.

In this first video, we'll talk about "The 5 questions data science answers."

Data Science uses numbers and names (also known as categories or labels) to predict answers to questions.

It might surprise you, but *there are only five questions that data science answers*:

  * Is this A or B?
  * Is this weird?
  * How much – or – How many?
  * How is this organized?
  * What should I do next?

  Each one of these questions is answered by a separate family of machine learning methods, called algorithms.


It's helpful to think about an algorithm as a recipe and your data as the ingredients. An algorithm tells how to combine and mix the data in order to get an answer. Computers are like a blender. They do most of the hard work of the algorithm for you and they do it pretty fast.

## Question 1: Is this A or B? uses classification algorithms

Let's start with the question: Is this A or B?

![Classification algorithms: Is this A or B?](./media/machine-learning-data-science-for-beginners-the-5-questions-data-science-answers/machine-learning-data-science-classification-algorithms.png)

This family of algorithms is called two-class classification.

It's useful for any question that has just two possible answers.

For example:

  *	Will this tire fail in the next 1,000 miles: Yes or no?
  *	Which brings in more customers: a $5 coupon or a 25% discount?

This question can also be rephrased to include more than two options: Is this A or B or C or D, etc.?  This is called multiclass classification and it's useful when you have several—or several thousand—possible answers. Multiclass classification chooses the most likely one.

## Question 2: Is this weird? uses anomaly detection algorithms

The next question data science can answer is: Is this weird? This question is answered by a family of algorithms called anomaly detection.

![Anomaly Detection algorithms: Is this weird?](./media/machine-learning-data-science-for-beginners-the-5-questions-data-science-answers/machine-learning-data-science-anomaly-detection-algorithms.png)


If you have a credit card, you’ve already benefitted from anomaly detection. Your credit card company analyzes your purchase patterns, so that they can alert you to possible fraud. Charges that are "weird" might be a purchase at a store where you don't normally shop or buying an unusually pricey item.

This question can be useful in lots of ways. For instance:

  *	If you have a car with pressure gauges, you might want to know: Is this pressure gauge reading normal?
  *	If you're monitoring the internet you’d want to know: Is this message from the internet typical?

Anomaly detection flags unexpected or unusual events or behaviors. It gives clues where to look for problems.



## Question 3: How much? or How many? uses regression algorithms

Machine learning can also predict the answer to How much? or How many? The algorithm family that answers this question is called regression.

![Regression algorithms: How much? or How many?](./media/machine-learning-data-science-for-beginners-the-5-questions-data-science-answers/machine-learning-data-science-regression-algorithms.png)


Regression algorithms make numerical predictions, such as:

  *	What will the temperature be next Tuesday?  
  *	What will my fourth quarter sales be?

They help answer any question that can asks for a number.

## Question 4: How is this organized? uses clustering algorithms

Now the last two questions are a bit more advanced.

Sometimes you want to understand the structure of a data set - How is this organized? For this question, you don’t have examples that you already know outcomes for.

There are a lot of ways to tease out the structure of data. One approach is clustering. It separates data into natural "clumps," for easier interpretation. With clustering there is no one right answer.

![Clustering algorithms: How is this organized?](./media/machine-learning-data-science-for-beginners-the-5-questions-data-science-answers/machine-learning-data-science-clustering-algorithms.png)

Common examples of clustering questions are:

  *	Which viewers like the same types of movies?
  *	Which printer models fail the same way?

By understanding how data is organized, you can better understand - and predict - behaviors and events.  

## Question 5: What should I do now? uses reinforcement learning algorithms

The last question – What should I do now? – uses a family of algorithms called reinforcement learning.

Reinforcement learning was inspired by how the brains of rats and humans respond to punishment and rewards. These algorithms learn from outcomes, and decide on the next action.

Typically, reinforcement learning is a good fit for automated systems that have to make lots of small decisions without human guidance.

![Reinforcement Learning algorithms: What should I do next?](./media/machine-learning-data-science-for-beginners-the-5-questions-data-science-answers/machine-learning-data-science-reinforcement-learning-algorithms.png)

Questions it answers are always about what action should be taken - usually by a machine or a robot. Examples are:

  *	If I'm a temperature control system for a house: Adjust the temperature or leave it where it is?  
  *	If I'm a self-driving car: At a yellow light, brake or accelerate?  
  *	For a robot vacuum: Keep vacuuming, or go back to the charging station?

Reinforcement learning algorithms gather data as they go, learning from trial and error.

So that's it - The 5 questions data science can answer.



## Next steps

  * [Try your first data science experiment with Azure Machine Learning](machine-learning-create-experiment.md)
  * [Get an introduction to Machine Learning on Microsoft Azure](machine-learning-what-is-machine-learning.md)
