<properties pageTitle="Machine Learning Sample: Predict student performance | Azure" description="A sample Azure Machine Learning experiment to develop a model that predicts student performance on tests." services="machine-learning" documentationCenter="" authors="Garyericson" manager="paulettm" editor="cgronlun"/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/10/2014" ms.author="garye"/>


# Azure Machine Learning sample: Prediction of student performance

>[AZURE.NOTE]
>The [Sample Experiment] and [Sample Dataset] associated with this model are available in ML Studio. See below for more details.
[Sample Experiment]: #sample-experiment
[Sample Dataset]: #sample-dataset


##Dataset and problem description
In this experiment our dataset is Algebra_2008_2009 training set from KDD Cup 2010. This dataset can be downloaded from [https://pslcdatashop.web.cmu.edu/KDDCup/downloads.jsp](https://pslcdatashop.web.cmu.edu/KDDCup/downloads.jsp) . The dataset contains log files of student tutoring system. The supplied features include problem id and its brief description, student id, timestamp and how many attempt student did before solving the problem in the right way. The learning problem is to predict if a student will solve a given problem from the first attempt. Following KDD Cup rules, we measure the accuracy of learning algorithms using [Root Mean Square Error](http://en.wikipedia.org/wiki/Root-mean-square_deviation) (RMSE). The original dataset has 8.9M records. To speed up the experiment we downsampled the dataset to the first 100K rows. The dataset has 23 columns of various types: numeric, categorical and timestamp. The columns are tab-separated.
 
##Development workflow
The dataset has non-ASCII characters that cannot be handled by **Apply R Operation** module. Before using dataset in Passau we removed non-ASCII characters using the following Powershell commands:  

	gc algebra_2008_2009_train.txt –head 100000 | sc algebra_train_small.txt
	sc tmp.txt -Encoding ASCII -Value (gc algebra_train_small.txt)
	cat tmp.txt | %{$_ -replace "\?\?sqrt","+sqrt"} | sc algebra_train_small.txt_ascii  

The resulting file algebra_train_small.txt_ascii is still quite large, it takes 36M. We store this file into Azure blob storage and then load the file into experiment using **Reader** module. Powershell commands for storing file in the blob storage are:  

	Add-AzureAccount
	$key = Get-AzureStorageKey -StorageAccountName <your storage account name>
	$ctxt = New-AzureStorageContext -StorageAccountName $key.StorageAccountName -StorageAccountKey $key.Primary
	Set-AzureStorageBlobContent –Container <container name in your storage account> -File "algebra_train_small.txt_ascii" –Context $ctxt

![][1]
 
The parameters of **Reader** module are shown above. In this example storage account name is “datascience”, the dataset file algebra_train_small.txt_ascii is placed in container “sampleexperiments”. Account key is an access key of Azure storage account. This key can be retrieved from your account at Azure management portal ([https://manage.windowsazure.com](https://manage.windowsazure.com)).
 
![][2]
 
In the next steps, shown above, we do a number of transformations to get dataset into format that will fit our learning algorithms. We use **Metadata Editor** to convert the timestamp column “First Transaction Time” into string format. This is needed for generating train/test split. Then, using **Project Columns**, we remove a number of columns that won't be used in experiment. We use Missing Value Scrubber to replace all missing values with 0. At the next step we split “Unit Name, Section Name” column into two columns, “Unit Name” and “Section Name”. This is done using the following R code in **Execute R** module:  

	dataset <- maml.mapInputPort(1)
	b <- data.frame(do.call(rbind,strsplit(as.vector(dataset[,3]),",")))
	names(b) <- c("Unit Name","Section Name")
	data.set <- cbind(dataset[,1:2],b,dataset[,4:15])
	maml.mapOutputPort("data.set")  

 
The first steps of experiment that include loading the data and initial transformations are shown above. After massaging the data we split experiment into 4 branches. In each branch we test a different set of features. Some of our feature sets were previously used by [1]. In the first branch, depicted below, our feature set is StudentID, Unit  

![][3]  
![][4]
 
 
Name, Section Name, Problem Name, Problem View and Opportunity features, as well as Textual Description of the problem. Non-integer features are represented as categorical features. In this branch we start with removing Hints column using **Project Columns**, because Hints column is not available when predicting the success of new student. Then we use **Split** module to split the dataset into training and test set. Since all examples have time stamps, our split will be time-based.  All rows with First Transaction Time from 2008 are in the training set, the ones from 2009 are in the test set. The parameters of **Spit** module are show at the right. After splitting, we generate a binary classification model using Boosted Decision Tree and score the test data. The label column in **Train Model** module is Correct First Attempt.  

![][5]  

 
In the next sequence of **Apply Math Operation** and **Elementary Statistics** modules, shown above, we compute RMSE of the model using raw scores and true labels. Note that for regression models this metric is computed by **Evaluator** module. But for other models we need to compute this metric manually. In the first **Apply Math Operation** module we compute the difference between the label column and the score column that was generated by **Score Model** module. In the second **Apply Math Operation** module we compute the square of this difference. Then **Elementary Statistics** module computed the mean of the squared differences. Finally the last **Apply Math Operation** module is used for computing the squared root. The parameters of these four modules are shown below.  

![][6] 
![][7]  
![][8]  
![][9] 
 
 
In the second branch, shown above, we also leverage time dimension. In addition to the features from the first branch we use names of the last two steps of the problem that is currently solved by the user along with their description. In the supplied dataset all user's activities are stored in the ascending order of timestamp. Also in the supplied dataset users' activities are not interleaved, namely initially there are all rows of first user, then there are all rows of second user and so on. Thus to find the last steps of the user we leverage RowID column. For a fixed user this column serves as a time axis. By adding 1 to this column, using Apply Math Operation****, we shift each row one time unit forwards. Then we use **Join** module to join the original dataset with the shifted one using RowID, StudentID and ProblemName as keys. As a result we get an expanded dataset where each row has a record from times t and t-1 for the same StudentID and ProblemName. We use *Left Outer Join* to keep rows that don't have previous steps with the same StudentID and ProblemID. We apply the combination of **Apply Math Operation** and **Join** one more time to get features two steps ago. The exact parameters of **Apply Math Operation** and **Join** are shown below.  

![][10]  
![][11]  
![][12]  

 
After performing two we get a number of columns that are identical. For example, due to our usage of Join module, ProblemName column is replicated 3 times, for steps t, t-1, and t-2. We use **Project Columns** module to remove redundant columns. Finally, since we used *Left Outer Join*, some of the rows that are generated by Join operator can have missing values. We use **Missing Values Scrubber** to replace all missing valued with “0” string. The parameters of **Missing Values Scrubber** are shown above.  

After computing the new set of features the workflow of the second branch is identical to the one of the first branch.  

![][13]
 
In the third branch, in addition to the features used in the second branch, we also use quadratic and cubic features that are concatenations of the original features from the first branch. Quadratic and cubic features are computed using **Execute R Operation** module with the R code shown above. After computing the new feature set we proceed with training, scoring and evaluation in the same way as in the first two branches.  

In the fourth branch we use features that are completely different from the ones in the first three branches. For each StudentID we compute the average value of Correct First Attempt up to (but not including) time t. We denote this value as CFA(StudentID,t). Similarly, we denote by Hints(StudentID,t) the average value of Hints for a fixed StudentID up to (but not including) time t. To speed up the computation of these averages, instead of considering the entire dataset we only look at 10 most recent records before time t. The definitions of CFA(Problem Name,t), CFA(Step Name,t), CFA(Description,t), Hints(Problem Name,t), Hints(Step Name,t) and Hints(Description,t) are similar. Given an example x with First Transaction Time=t(x) and column values StudentID(x), Problem Name(x), Step Name(x) and Description(x), we generate the above 8 CFA and Hints features:  

	CFA(StudentID(x),t(x)), CFA(Problem Name(x),t(x)), CFA(Step Name(x),t(x)), CFA(Description(x),t(x)), 
	Hints(StudentID(x),t(x)), Hints(Problem Name(x),t(x)), Hints(Step Name(x),t(x)), Hints(Description(x),t(x))  

![][14]  

 
Similarly we also compute 8 additional CFA and Hints features using concatenations of StudentID and Problem Name, Problem Name and Step Name, StudentId and UnitName, StudentID and Problem Description. Overall we obtain 16 features that are used to predict the value of Correct First Attempt column. The computation of these 16 features is done using R code within **Execute R Operation** module. This code is long and tedious, but highly optimized. After computing there features we remove some auxiliary columns that were added by R code. For this purpose we use **Project Columns** module. The complete workflow for computing features in the fourth branch is shown above. After computing the new feature set we proceed with training, scoring and evaluation in the same way as in the first three branches.  

After computing RMSE values in all four branches we collect the results using **Add Row** module. Also we generate annotations using **Execute R** module. The workflow of this final part of experiment is depicted below.  

![][15]  
 
 
The final output of the experiment is the following table, the first column is the name of the feature set and the second row is RSME as measured over the test examples:  

![][16]
 

We conclude the fourth set of features gives the lowest RMSE.  

##References
H.-F. Yu et al. Feature Engineering and Classifier Ensemble for KDD Cup 2010. KDD Cup 2010 Workshop, 2010.



## Sample Experiment

The following sample experiment associated with this model is available in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab.

> **Sample Experiment - Student Performance - Development**


## Sample Dataset

The following sample dataset used by this experiment is available in Azure BLOB storage.

<ul>
<li><b><a href="https://azuremlsampleexperiments.blob.core.windows.net/datasets/student_performance.txt">student_performance.txt</a></b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-student-performance](../includes/machine-learning-sample-dataset-student-performance.md)]
<p></p></li>
</ul>



[1]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-1.jpg
[2]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-2.jpg
[3]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-3.jpg
[4]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-4.jpg
[5]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-5.jpg
[6]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-6.jpg
[7]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-7.jpg
[8]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-8.jpg
[9]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-9.jpg
[10]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-10.jpg
[11]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-11.jpg
[12]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-12.jpg
[13]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-13.jpg
[14]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-14.jpg
[15]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-15.jpg
[16]: ./media/machine-learning-sample-prediction-of-student-performance/student-performance-16.jpg
