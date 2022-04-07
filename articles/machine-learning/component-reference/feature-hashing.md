---
title: "Feature Hashing component reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Feature Hashing component in the Azure Machine Learning designer to featurize text data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/22/2020
---
# Feature Hashing component reference

This article describes a component included in Azure Machine Learning designer.

Use the Feature Hashing component to transform a stream of English text into a set of integer features. You can then pass this hashed feature set to a machine learning algorithm to train a text analytics model.

The feature hashing functionality provided in this component is based on the nimbusml framework. For more information, see [NgramHash class](/python/api/nimbusml/nimbusml.feature_extraction.text.extractor.ngramhash?view=nimbusml-py-latest&preserve-view=true).

## What is feature hashing?

Feature hashing works by converting unique tokens into integers. It operates on the exact strings that you provide as input and does not perform any linguistic analysis or preprocessing. 

For example, take a set of simple sentences like these, followed by a sentiment score. Assume that you want to use this text to build a model.

|User text|Sentiment|
|--------------|---------------|
|I loved this book|3|
|I hated this book|1|
|This book was great|3|
|I love books|2|

Internally, the Feature Hashing component creates a dictionary of n-grams. For example, the list of bigrams for this dataset would be something like this:

|Term (bigrams)|Frequency|
|------------|---------------|
|This book|3|
|I loved|1|
|I hated|1|
|I love|1|

You can control the size of the n-grams by using the **N-grams** property. If you choose bigrams, unigrams are also computed. The dictionary would also include single terms like these:

|Term (unigrams)|Frequency|
|------------|---------------|
|book|3|
|I|3|
|books|1|
|was|1|

After the dictionary is built, the Feature Hashing component converts the dictionary terms into hash values. It then computes whether a feature was used in each case. For each row of text data, the component outputs a set of columns, one column for each hashed feature.

For example, after hashing, the feature columns might look something like this:

|Rating|Hashing feature 1|Hashing feature 2|Hashing feature 3|
|-----|-----|-----|-----|
|4|1|1|0|
|5|0|0|0|

* If the value in the column is 0, the row didn't contain the hashed feature.
* If the value is 1, the row did contain the feature.

Feature hashing lets you represent text documents of variable length as numeric feature vectors of equal length to reduce dimensionality. If you tried to use the text column for training as is, it would be treated as a categorical feature column with many distinct values.

Numeric outputs also make it possible to use common machine learning methods, including classification, clustering, and information retrieval. Because lookup operations can use integer hashes rather than string comparisons, getting the feature weights is also much faster.

## Configure the Feature Hashing component

1.  Add the Feature Hashing component to your pipeline in the designer.

1. Connect the dataset that contains the text you want to analyze.

    > [!TIP]
    > Because feature hashing does not perform lexical operations such as stemming or truncation, you can sometimes get better results by preprocessing text before you apply feature hashing. 

1. Set **Target columns** to the text columns that you want to convert to hashed features. Keep in mind that:

    * The columns must be the string data type.
    
    * Choosing multiple text columns can have a significant impact on feature dimensionality. For example, the number of columns for a 10-bit hash goes from 1,024 for a single column to 2,048 for two columns.

1. Use **Hashing bitsize** to specify the number of bits to use when you're creating the hash table.
    
    The default bit size is 10. For many problems, this value is adequate. You might need more space to avoid collisions, depending on the size of the n-grams vocabulary in the training text.
    
1. For **N-grams**, enter a number that defines the maximum length of the n-grams to add to the training dictionary. An n-gram is a sequence of *n* words, treated as a unique unit.

    For example, if you enter 3, unigrams, bigrams, and trigrams will be created.

1. Submit the pipeline.

## Results

After processing is complete, the component outputs a transformed dataset in which the original text column has been converted to multiple columns. Each column represents a feature in the text. Depending on how significant the dictionary is, the resulting dataset can be large:

|Column name 1|Column type 2|
|-------------------|-------------------|
|USERTEXT|Original data column|
|SENTIMENT|Original data column|
|USERTEXT - Hashing feature 1|Hashed feature column|
|USERTEXT - Hashing feature 2|Hashed feature column|
|USERTEXT - Hashing feature n|Hashed feature column|
|USERTEXT - Hashing feature 1024|Hashed feature column|

After you create the transformed dataset, you can use it as the input to the Train Model component.
 
## Best practices

The following best practices can help you get the most out of the Feature Hashing component:

* Add a Preprocess Text component before using Feature Hashing to preprocess the input text. 

* Add a Select Columns component after the Feature Hashing component to remove the text columns from the output dataset. You don't need the text columns after the hashing features have been generated.
    
* Consider using these text preprocessing options, to simplify results and improve accuracy:

    * Word breaking
    * Stopping word removal
    * Case normalization
    * Removal of punctuation and special characters
    * Stemming  

The optimal set of preprocessing methods to apply in any solution depends on domain, vocabulary, and business need. pipeline with your data to see which text processing methods are most effective.

## Next steps
			
See the [set of components available](component-reference.md) to Azure Machine Learning
