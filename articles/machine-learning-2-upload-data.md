<properties title="Upload existing data" pageTitle="Upload existing data" description="Step 2: Upload existing public data into ML Studio" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

#Upload existing data  

To develop a predictive model for credit risk, we’ll use the “UCI Statlog (German Credit Data) Data Set” from the UCI Machine Learning repository. You can find it here:  
[http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data)](http://archive.ics.uci.edu/ml/datasets/Statlog+(German+Credit+Data))  

We’ll use the file named **german.data**. Download this file to your local hard drive.  

This dataset contains rows of 20 variables for 1000 past applicants for credit. These 20 variables represent the dataset’s feature vector which provides identifying characteristics for each credit applicant. An additional column in each row represents the applicant’s credit risk, with 700 applicants identified as a good credit risk and 300 as a bad risk.   

The UCI website provides a description of the attributes of the feature vector which include financial information, credit history, employment status, and personal information. For each applicant a binary rating has been given indicating whether they are a good or bad credit risk.  

We’ll use this data to train a predictive analytics model. When we’re done, our model should be able to accept information for new individuals and predict whether they are a good or bad credit risk.  

Here’s one interesting twist. The description of the dataset explains that misclassifying a person as a good credit risk when they are actually a bad credit risk is 5 times more costly to the financial institution than misclassifying a good credit risk as bad. One simple way to take this into account in our experiment is by duplicating (5 times) those entries that represent someone with a bad credit risk. Then, if the model misclassifies a bad credit risk as good, it will do that misclassification 5 times, once for each duplicate. This will increase the cost of this error in the training results.  

##Convert the dataset format
The original dataset uses a blank-separated format. CloudML Studio works better with a comma-separated (CSV) file, so we’ll convert the dataset by replacing spaces with commas.  

We can do this using the following PowerShell command:   

	cat german.data | %{$_ -replace " ",","} | sc german.csv  

We can also do this using the Unix sed command:  

	sed 's/ /,/g' german.data > german.csv  

##Upload the dataset to ML Studio
Once the data has been converted to CSV format, we need to upload it into CloudML Studio.  

1.	In CloudML Studio, click **+NEW** at the bottom of the window
2.	Select **DATASET**
3.	Select **FROM LOCAL FILE**
4.	In the **Upload a new dataset dialog**, click **Browse** and find the **german.csv** file you created
5.	Enter a name for the dataset – for this example we’ll call it “UCI German Credit Card Data”
6.	For data type, select “Generic CSV File With no header (.nh.csv)”
7.	Add a description if you’d like
8.	Click **OK**  
![][1]  

 
This uploads the data into a Dataset module that we can use in an experiment.



[1]: ./media/machine-learning-2-upload-data/upload1.png