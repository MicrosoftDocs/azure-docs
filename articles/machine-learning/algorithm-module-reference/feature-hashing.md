# Feature Hashing

This article describes how to use the **Feature Hashing** module in visual interface (preview) for Azure Machine Learning service, to transform a stream of English text into a set of features represented as integers. You can then pass this hashed feature set to a machine learning algorithm to train a text analysis model.

The feature hashing functionality provided in this module is based on the nimbusml framework. For more information, see from [nimbusml ngramhash](https://docs.microsoft.com/en-us/python/api/nimbusml/nimbusml.feature_extraction.text.extractor.ngramhash?view=nimbusml-py-latest).

### More about feature hashing

Feature hashing works by converting unique tokens into integers. It operates on the exact strings that you provide as input and does not perform any linguistic analysis or preprocessing. 

For example, take a set of simple sentences like these, followed by a sentiment score. Assume that you want to use this text to build a model.

|USERTEXT|SENTIMENT|
|--------------|---------------|
|I loved this book|3|
|I hated this book|1|
|This book was great|3|
|I love books|2|

Internally, the **Feature Hashing** module creates a dictionary of n-grams. For example, the list of bigrams for this dataset would be something like this:

|TERM (bigrams)|FREQUENCY|
|------------|---------------|
|This book|3|
|I loved|1|
|I hated|1|
|I love|1|

You can control the size of the n-grams by using the **N-grams** property. If you choose bigrams, unigrams are also computed. Thus, the dictionary would also include single terms like these:

|Term (unigrams)|FREQUENCY|
|------------|---------------|
|book|3|
|I|3|
|books|1|
|was|1|

After the dictionary has been built, the **Feature Hashing** module converts the dictionary terms into hash values, and computes whether a feature was used in each case. For each row of text data, the module outputs a set of columns, one column for each hashed feature.

For example, after hashing, the feature columns might look something like this:

|Rating|Hashing feature 1|Hashing feature 2|Hashing feature 3|
|-----|-----|-----|-----|
|4|1|1|0|
|5|0|0|0|

- If the value in the column is 0, the row did not contains the hashed feature.
- If the value is 1, the row did contain the feature.

The advantage of using feature hashing is that you can represent text documents of variable-length as numeric feature vectors of equal-length, and achieve dimensionality reduction. In contrast, if you tried to use the text column for training as is, it would be treated as a categorical feature column, with many, many distinct values.

Having the outputs as numeric also makes it possible to use many different machine learning methods with the data, including classification, clustering, or information retrieval. Because lookup operations can use integer hashes rather than string comparisons, getting the feature weights is also much faster.

## How to configure Feature Hashing

1.  Add the **Feature Hashing** module to your experiment in visual interface.

2. Connect the dataset that contains the text you want to analyze.

    > [!TIP]
    > Because feature hashing does not perform lexical operations such as stemming or truncation, you can sometimes get better results by doing text preprocessing before applying feature hashing. 
3. For **Target columns**, select those text columns that you want to convert to hashed features. 

    - The columns must be the string data type.
    
    - If you choose multiple text columns to use as inputs, it can have a huge effect on feature dimensionality. For example, if a 10-bit hash is used for a single text column, the output contains 1024 columns. If a 10-bit hash is used for two text columns, the output contains 2048 columns.

4. Use **Hashing bitsize** to specify the number of bits to use when creating the hash table.
    
    The default bit size is 10. For many problems, this value is more than adequate, but whether suffices for your data depends on the size of the n-grams vocabulary in the training text. With a large vocabulary,  more space might be needed to avoid collisions.
    
    We recommend that you try using a different number of bits for this parameter, and evaluate the performance of the machine learning solution.
    
5. For **N-grams**, type a number that defines the maximum length of the n-grams to add to the training dictionary. An n-gram is a sequence of *n* words, treated as a unique unit.
      
      -   **N-grams** = 1: Unigrams, or single words.
      
      -   **N-grams** = 2: Bigrams, or two-word sequences, plus unigrams.
      
      -   **N-grams** = 3: Trigrams, or three-word sequences, plus bigrams and unigrams.

6. Run the experiment.

### Results
For example, take a set of simple sentences like these, followed by a sentiment score. Assume that you want to use this text to build a model.

|USERTEXT|SENTIMENT|
|--------------|---------------|
|I loved this book|3|
|I hated this book|1|
|This book was great|3|
|I love books|2|


After processing is complete, the module outputs a transformed dataset in which the original text column has been converted to multiple columns, each representing a feature in the text. Depending on how big the dictionary is, the resulting dataset can be extremely large:

|Column name 1|Column type 2|
|-------------------|-------------------|
|USERTEXT|Original data column|
|SENTIMENT|Original data column|
|USERTEXT - Hashing feature 1|Hashed feature column|
|USERTEXT - Hashing feature 2|Hashed feature column|
|USERTEXT - Hashing feature n|Hashed feature column|
|USERTEXT - Hashing feature 1024|Hashed feature column|

After you have created the transformed dataset, you can use it as the input to the Train Model module.
 
### <a name="bkmk_BestPractice"></a> Best practices

Some best practices that you can use while modeling text data are demonstrated in the following diagram representing an experiment
  
![avatar](./image/feature_hashing_example.png)

- You might need to add an Preprocess Text module before using **Feature Hashing**, in order to preprocess the input text. 

- You should add a Select Columns module after the **Feature Hashing** module to remove the text columns from the output data set. You do not need the text columns after the hashing features have been generated.
    
    
Also consider using these text preprocessing options, to simplify results and improve accuracy:

+ word breaking
+ stop word removal
+ case normalization
+ removal of punctuation and special characters
+ stemming.  

The optimal set of preprocessing methods to apply in any individual solution depends on domain, vocabulary, and business need. We recommend that you experiment with your data to see which custom text processing methods are most effective.


