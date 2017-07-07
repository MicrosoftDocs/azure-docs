---
title: Cortana Intelligence Competitions FAQ | Microsoft Docs
description: Frequently asked questions about Microsoft Cortana Intelligence Competitions.
services: machine-learning
documentationcenter: ''
author: hning86
manager: jhubbard
editor: cgronlun

ms.assetid: 9bac5154-a56c-4e78-9d67-34368b9d1624
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/10/2017
ms.author: haining;garye

---
# Microsoft Cortana Intelligence Competitions FAQ
**What is Cortana Intelligence Competitions?**

The Microsoft Cortana Intelligence Competitions allow us to unite a global community of data enthusiasts by collectively solving some of the world’s most complex data science problems. Cortana Intelligence Competitions allow data enthusiasts from across the world to compete and build highly accurate and intelligent data science models. Our hosted competitions are based on unique data sets that have been made available publically for the first time. Participants can win rewards or get recognition via our top 10 public leaderboard. Please go [here](http://aka.ms/CIComp) to access the Competitions home page.

**How often will Microsoft release new competitions?**

We will be launching 1st-party, Microsoft-owned competitions on a regular basis, approximately every 8-12 weeks. 

**Where can I ask general questions about data science?**

Please use our [Microsoft Azure Machine Learning
forum](https://social.msdn.microsoft.com/forums/azure/home?forum=MachineLearning).

**How do I enter a competition?**

Access the [Competitions](https://gallery.cortanaintelligence.com/competitions) home page in the [Cortana Intelligence Gallery](https://gallery.cortanaintelligence.com/), or go to [http://aka.ms/CIComp](http://aka.ms/CIComp). The home page lists all competitions that are currently running. Each competition has detailed instructions and participation rules, prizes, and duration on its sign-up page.

1. Find the competition you’d like to participate in, read all the instructions and watch the tutorial video, then click the **Enter Competition** button to copy the Starter Experiment into your existing Azure Machine Learning workspace. If you don’t already have access to a workspace, you must create one beforehand. Run the Starter Experiment, observe the performance metric, then use your creativity to improve the performance of the model. You'll likely spend the majority of your time in this step.   

2. Create a Predictive Experiment with the trained model out of your Starter Experiment. Then carefully adjust the input and output schema of the web service to ensure they conform to the requirements specified in the competition documentation. The tutorial document generally will have detailed instructions for this. You can also watch the tutorial video, if available.   

3. Deploy a web service out of your Predictive Experiment. Test your web service using the **Test** button or the Excel template automatically created for you to ensure it's working properly.   

4. Submit your web service as the competition entry and see your public score in the Cortana Intelligence Gallery competition page. And celebrate if you make it onto the leaderboard!  

After you successfully submit an entry, you can go back to your copied Starter Experiment, iterate, and update your Predictive Experiment, update the web service, and submit a new entry.   

**Can I use open source tools for participating in these competitions?**

The competition participants leverage Azure Machine Learning Studio, a cloud-based service within Cortana Intelligence Suite for development of the data science models and to create competition entries for submission. Machine Learning Studio not only provides a GUI interface for constructing machine learning experiments, it also allows you to bring your own R and/or Python scripts for native execution. The R and Python runtimes in Studio come with a rich set of open source R/Python packages, and you can import your own packages as part of the experiment as well. Studio also has a built-in Jupyter Notebook service for you to do free style data exploration. Of course, you can always download the datasets used in the competition and explore it in your favorite tool outside of Machine Learning Studio. 

**Do I need to be a data scientist to enter?**

No. In fact, we encourage data enthusiasts, those curious about data science, and other aspiring data scientists to enter our contest. We have designed supporting documents to allow everyone to compete. Our target audience is:

* **Data Developers**, **Data Scientists**, **BI** and **Analytics Professionals**: those who are responsible for producing data and analytics content for others to consume
* **Data Stewards**: those who have the knowledge about the data, what it means, and how it's intended to be used and for which purpose
* **Students** & **Researchers:** those who are learning and gaining data related skills via academic programs in universities, or participants in Massive Open Online Courses (MOOCs)

**Can I enter with my colleagues as a team?**

The competition platform currently doesn't support team participation. Each competition entry is tied to a single user identity. 

**Do I need to pay to participate in a competition?**

Competitions are free to participate in. You do, however, need access to an Azure Machine Learning workspace to participate. You can create a Free workspace without a credit card by simply logging in with a valid Microsoft account, or an Office 365 account. If you're already an Azure or Cortana Intelligence Suite customer, you can create and use a Standard workspace under the same Azure subscription. If you'd like to purchase an Azure subscription, go to the [Azure pricing](https://azure.microsoft.com/pricing) page. Note that the standard rates will apply when using a Standard workspace to construct experiments. See [Azure Machine Learning pricing information](https://azure.microsoft.com/pricing/details/machine-learning/) for more information. 

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

**What are public and private scores?**

In most competitions, you'll notice that you'll receive a public score for every submission you make, generally within 10-20 minutes. But after the competition ends, you'll receive a private score which is used for final ranking. 

Here's what happens:

* The entire dataset used in the competition is randomly split with stratification into training and testing (the remaining) data. The random split is stratified to ensure that the distributions of labels in both training and testing data are consistent.
* The training data is uploaded and given to you as part of the Starter Experiment in the Import Data module configuration.
* The testing data is further split into public and private testing data, using the same stratification.
* The public testing data is used for the initial round of scoring. The result is referred to as the public score and it's what you see in your submission history when you submit your entry. This score is calculated for every entry you submit. This public score is used to rank you on the public leaderboard.
* The private testing data is used for the final round of scoring after the competition ends. This is referred to as private score. 
* For each participant, a fixed number of entries with the highest public scores are automatically selected to enter the private scoring round (this number can vary depending on the competition). The entry with the highest private score is then selected to enter the final ranking, which ultimately determines the prize winners.  

**Can customers host a competition on our platform?**

We welcome 3rd-party organizations to partner with us and host both public and private competitions on our platform. We have a competition onboarding team who will be happy to discuss the onboarding process for such competitions.  Please get in touch with us at [compsupport@microsoft.com](mailto:compsupport@microsoft.com) for more details. 

**What are the limitations for submissions?**

A typical competition may choose to limit the number of entries you can submit within a 24-hour span (UTC time 00:00:00 to 23:59:59), and the total number of entries you can submit over the duration of the competition. You'll receive appropriate error messages when a limitation is exceeded. 

**What happens if I win a competition?**

Microsoft will verify the results of the private leaderboard, and then we'll contact you. Please make sure that your email address in your user profile is up to date.

**How will I get the prize money if I win a competition?**

If you are a competition winner, you will need to sign a declaration of eligibility, license, and release from. This form reiterates the Competition Rules. Winners need to fill out a US Tax form W-9, or a Form W-8BEN if they are not US taxpayers. We will contact all winners as part of the rewards disbursement process by using their registration email. Please refer to our [Terms and Conditions](http://aka.ms/comptermsandconditions) for additional details.

**What if more than one entry receives the same score?**

The submission time is the tie-breaker. The entry submitted earlier outranks the entry submitted later.

**Can I participate using guest workspace?**

No. You must use a Free or a Standard workspace to participate. You can open the competition starter experiment in a Guest workspace, but you'll not be able to create a valid entry for submission from that workspace. 

**Can I participate using a workspace in any Azure region?**

Currently, the competition platform only supports entries submitted from a workspace in the **South Central US** Azure region. All Free workspaces reside in South Central US, so you can submit an entry from any Free workspace. If you choose to use a Standard workspace, just ensure that it resides in the South Central US Azure region, otherwise your submission won't succeed. 

**Do we keep users’ competitions solutions and entries?**

User entries are only retained for evaluation purposes to identify the winning solutions. Please refer to our [Terms and Conditions](http://aka.ms/comptermsandconditions) for specifics.

