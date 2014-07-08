# CRM Task #
## Problem Description ##
Prediction of customer churn (switch provider), upsell (buy upgrades or add-ons) and propensity to buy a new product (appetency) 
## Data ##
Dataset of 50K customers of French Telecom Company Orange in France. Each customer has 230 anonymized features. This data comes from the KDD Cup 2009. 

There are both numeric and string features. The features are very sparse. 
## Model ##
The only preprocessing of the data was to treat missing values. We substituted "0" for the missing values in string features. Almost all numeric features have non-negative values. We added 1 to the existing values of numeric features and substituted 0 in the entries with missing value. In this way we distinguish between actual original 0's and 0's that indicate missing value. We did this by first applying a math operation (+1) to only the numerical features. After this, we replaced all missing values by 0 (or "0" for strings). 

Since we have both numeric and categorical features, we used a boosted decision tree classifier. All 3 problems are unbalanced, with positive examples being a minority. In some cases this can cause the classifier to ignore regions in feature space with a small number of positive samples. To test this, we trained two models for each problem: one using the raw data, and the other by replicating positive examples so that the new number of positive examples roughly equals the number of negative test examples. This was achieved using a simple R script that split the positive and negative examples, then appended 13 copies of the positive set to the negative set. 
## Results ##
The models output a score related to the probability for a positive outcome for each of the tasks. Since an arbitrary cut-off threshold can be selected to label an observation as positive, we measure performance by the area under the receiver operating characteristic (ROC) curve (AUC). Note that for both the Churn and Up-sell cases, replicating positive samples to create a more balanced set marginally improved the performance of the model.  

<table border="1">
<tr><td>Churn</td><td>AUC</td></tr>
<tr style="background-color: #fff"><td>no replication</td><td>0.711</td></tr>
<tr><td>replicated positives</td><td>0.728</td></tr>
</table>


<table border="0">
<tr><td>Upsell</td><td>AUC</td></tr>
<tr style="background-color: #fff"><td>no replication</td><td>0.853</td></tr>
<tr><td>replicated positives</td><td>0.865</td></tr>
</table>


<table border="0">
<tr><td>Appetency</td><td>AUC</td></tr>
<tr style="background-color: #fff"><td>no replication</td><td>0.805</td></tr>
<tr><td>replicated positives</td><td>0.8</td></tr>
</table>

## API ##
We didn't operationalize the model because it has anonymous features.
