<properties
	pageTitle="Machine Learning Competition FAQ | Microsoft Azure"
	description="Frequently asked questions about Microsoft Azure Machine Learning competitions."
	services="machine-learning"
	documentationCenter=""
	authors="hning86"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/11/2016"
	ms.author="haining;chlovel;garye"/>

# Microsoft Azure Machine Learning Competition FAQ

**Where can I ask general questions about data science?**

Please use our [Microsoft Azure Machine Learning
forum](https://social.msdn.microsoft.com/forums/azure/home?forum=MachineLearning).

**How do I enter a competition?**

Create a free or paid account in [Microsoft Azure Machine
Learning](https://studio.azureml.net/?selectAccess=true&o=2%22%20\t%20%22_blank).
Follow the competition tutorial and watch the brief video.

**Do I need to be a data scientist to enter?**

No. In fact, we encourage data enthusiasts, those curious about data
scientist, and other non-expert data scientists to enter our contest. We
have designed supporting documents to allow everyone to compete.

**How long will this take?**

You may enter our competition and create a data model in a matter of
10-15 minutes. Refining your predictive experiment may take longer than
15 minutes depending on your familiarity with machine learning.

**How is my score calculated? Is it calculated differently while the
competition is running and after it closes? What are public and private
scores?**

1.  The entire dataset was randomly split with stratification into
training (60%) and testing (the remaining 40%) data. The random
split is stratified on geo + segment + subgroup to ensure that the
distributions of labels in both training and testing data are
consistent in each region.  

2.  The training data was uploaded and given to you as part of the
Starter Experiment in the Reader module configuration. 

3.  The testing data was further split into public and private testing
data, using the same stratification (60% for public testing, and
40% for private testing). 

4.  The public testing data was used for the initial round of scoring.
The result is referred to as public score and it is what you got
in your submission history when you submitted your entry. This was
done every time you submitted an entry. This public score is used
to rank you on the public leaderboard.  

5.  The private testing data was used for the final round of scoring
after the Competition ended. This is referred to as private
score.  

6.  For each participant, 5 of your entries with the highest public
scores were automatically selected to calculate the
private scores. The entry with the highest private score was
selected to enter the final ranking, which ultimately determined
the prize winners.  

**Do I have to pay for this?**

No, you may set up a free workspace in Microsoft Azure Machine Learning
to compete. Keep in mind that guest accounts do not have the ability to
save data, so be sure to submit your entry before the free 8 hours
expire.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

**How do I upgrade to a paid subscription?**

You can buy or update your subscription from this page on Microsoft
Azure Marketplace. See [this
page](https://azure.microsoft.com/pricing/details/machine-learning/)
for pricing FAQ.

**What is the Try Belize button?**

(Include Web services portal instructions and screenshot with steps to
go back)

**What happens if I win a competition?**

Microsoft will verify the results of the private leaderboard, and then
we will contact you. Please make sure that your email address in your
user profile is up to date.

**How will I get the prize money if I win a competition?**

If you are a competition winner, you will need to sign a declaration of
eligibility, license, and release from. This form reiterates the
Competition Rules. Winners need to fill out a US Tax form W-9, or a Form
W-8BEN if they are not US taxpayers.
