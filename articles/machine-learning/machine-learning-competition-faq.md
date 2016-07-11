<properties
	pageTitle="Cortana Intelligence Competitions FAQ | Microsoft Azure"
	description="Frequently asked questions about Microsoft Cortana Intelligence Competitions."
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
	ms.date="06/05/2016"
	ms.author="haining;chlovel;garye"/>

# Microsoft Cortana Intelligence Competitions FAQ

**What is Cortana Intelligence Competitions?**

Microsoft is announcing Cortana Intelligence Competitions. Cortana Intelligence Competitions allows us to unite a global community of data enthusiasts by collectively solving some of world’s most complex data science problems. Cortana Intelligence Competitions allow data enthusiasts from across the world to compete and build highly accurate and intelligent data science models. Our hosted competitions are based on unique data sets that have been made available publically for the first time. Participants can win rewards or get recognition via our top 10 public leaderboard. Please go [here](http://aka.ms/CIComp) to access the Competitions home page.

**How often will Microsoft release new competitions?**

We will be launching 1st party, Microsoft-owned competitions on a regular basis, approximately every 8-12 weeks. 

**Where can I ask general questions about data science?**

Please use our [Microsoft Azure Machine Learning
forum](https://social.msdn.microsoft.com/forums/azure/home?forum=MachineLearning).

**How do I enter a competition?**

Access the Competitions home page Competitions home page via the Cortana Intelligence Gallery. This page contains all competitions that are running. Each competition will have detailed instructions and participation rules, prizes, and duration on its sign up page. Please go [here](http://aka.ms/CIComp) to access the Competitions home page.  

1. Find the competition you’d like to participate in Cortana Intelligence Gallery, read all the instructions and watch the tutorial video, then click on the “Enter Competition” button to copy the Starter Experiment into your existing Azure Machine Learning workspace. If you don’t already have access to a workspace, you must create one beforehand. Run the Starter Experiment, observe the performance metric, then use your creativity to improve the performance of the model. You will likely spend majority of your time in this step.   

2. Create a Predictive Experiment with the trained model out of your Starter Experiment. Then carefully adjust the input and output schema of the web service to ensure they conform to the requirement specified in the Competition documentation. The tutorial document generally will have detailed instruction on how to accomplish this. You can also watch the tutorial video if available.   

3. Deploy a web service out of your Predictive Experiment. Test your web service using the Test button or the Excel template automatically created for you to ensure it is working properly.   

4. Submit your web service as the competition entry, and see your public score in the Cortana Intelligence Gallery competition page. And celebrate if you make into the leaderboard!  
After you successfully submit an entry, you can go back to the copied Starter Experiment, iterate, and update your Predictive Experiment, update the web service, and submit an new entry.   

**Can I use open source tools for participating in these Competitions?**

The competition participants leverage Azure Machine Learning Studio, a cloud-based service within Cortana Intelligence Suite for development of the data science models and create Competition entries for submission. ML Studio not only provides a GUI interface for constructing machine learning experiments, it also allows you to bring your own R and/or Python scripts for native execution. The R and Python runtime in ML Studio come with a rich set of open source R/Python packages, and you can import your own packages as part of the experiment as well. ML Studio also has a built-in JuPyteR Notebook service for you to do free style data exploration. Of course, you can always download the datasets used in the Competition and explore it in your favorite tool outside of ML Studio. 

**Do I need to be a data scientist to enter?**

No. In fact, we encourage data enthusiasts, those curious about data science, and other aspiring data scientists to enter our contest. We have designed supporting documents to allow everyone to compete. Our target audience is:

* Data Developers, Data Scientists, BI and Analytics Professionals: those who are responsible for producing data and analytics content for others to consume.

* Data Stewards: those who have the knowledge about the data, what it means, and how it is intended to be used and for which purpose.

* Students & Researchers: those who are learning and gaining data related skills via academic programs in universities or participants of Massive Open Online Courses (MOOCs)


**Can I enter with my colleagues as a team?**

The Competition platform currently does not support team participation. Each competition entry is tied to a single user identity. 

**Do I need to pay to participate in a competition?**

Competitions are free to participate in. You do, however, need access to an Azure Machine Learning workspace to participate. You can create a Free workspace without a credit card by simply logging in with a valid Microsoft account, or an Office 365 account. If you are already an Azure or Cortana Intelligence Suite customer, you can create and use a Standard workspace under the same Azure subscription. If you would like to purchase an Azure subscription you can go [here] (https://azure.microsoft.com/pricing). Note the standard rates will apply when using a Standard workspace to construct experiments. See Azure Machine Learning pricing information [here](https://azure.microsoft.com/pricing/details/machine-learning/). 

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

**What are public and private scores?**

In most competitions, you will notice that you will receive a public score for every submission you make, generally within 10-20 minutes. But after the competition ends, you will receive a private score which is used for final ranking. Here is what happens:

* The entire dataset used in the competition is randomly split with stratification into training and testing (the remaining) data. The random split is stratified to ensure that the distributions of labels in both training and testing data are consistent.
 
* The training data is uploaded and given to you as part of the Starter Experiment in the Import Data module configuration.

* The testing data is further split into public and private testing data, using the same stratification.

* The public testing data is used for the initial round of scoring. The result is referred to as public score and it is what you see in your submission history when you submit your entry. This score is calculated for every entry you submit. This public score is used to rank you on the public leaderboard.

* The private testing data is used for the final round of scoring after the Competition ended. This is referred to as private score. 

* For each participant, a fixed number, that can vary depending on the competition, among your entries with the highest public scores are automatically selected to enter the private scoring round. The entry with the highest private score is then selected to enter the final ranking, which ultimately determined the prize winners.  

**Can Customers host a Competition on our platform?**

We welcome 3rd-party organizations to partner with us and host both public and private competitions on our platform. We have a competition onboarding team who will be happy to discuss the onboarding process for such competitions.  Please get in touch with us at [compsupport@microsoft.com](mailto:compsupport@microsoft.com) for more details. 

**What are the limitations for submissions?**

A typical competition may choose to limit the number of entries you can submit within a 24-hour span (UTC time 00:00:00 to 23:59:59), and the total number of entries you can submit over the duration of the competition. You will receive proper error messages when a limitation is exceeded. 

**What happens if I win a Competition?**

Microsoft will verify the results of the private leaderboard, and then we will contact you. Please make sure that your email address in your user profile is up to date.

**How will I get the prize money if I win a Competition?**

If you are a competition winner, you will need to sign a declaration of eligibility, license, and release from. This form reiterates the Competition Rules. Winners need to fill out a US Tax form W-9, or a Form W-8BEN if they are not US taxpayers. We will contact all winners as part of the rewards disbursement process by using their registration email. Please refer to our [Terms and Conditions](http://aka.ms/comptermsandconditions) for additional details.

**What if more than one entry receives the same score?**

The submission time is the tie-breaker. The entry submitted earlier outranks the entry submitted later.

**Can I participate using Guest workspace?**

No. You must use a Free or a Standard workspace to participate. You can open the Competition starter experiment in a Guest workspace. But you will not be able to create a valid entry for submission. 

**Can I participate using a Workspace in any Azure region?**

Currently Competition platform only supports submitting entries from a workspace in South Central US Azure region. All Free workspaces live in South Central US. But if you choose to use a Standard workspace, please ensure it lives in South Central US Azure region. Otherwise your submission will not succeed. 

**Do we keep Users’ Competitions Solutions/Entries?**

User entries are only retained for evaluation purposes to identify the winning solutions. Please refer to our [Terms and Conditions](http://aka.ms/comptermsandconditions) for specifics.
