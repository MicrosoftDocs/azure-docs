---
title:  "Extract N-Gram: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Extract N-Gram module in Azure Machine Learning service to featurize text data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 09/30/2019
---
# Extract N-Gram Features from Text

This article explains how to use the **Extract N-Gram Features from Text** module, to *featurize* text.
  
The module works by creating a dictionary of n-grams from a column of free text that you specify as input. 

If you have already created a vocabulary of n-grams, you can use the existing vocabulary as well. 
 
Because this module supports featurization from n-grams, it can also be used for scoring.

## How to configure Extract N-Gram Features from Text

This module supports the following scenarios for creating, updating, or applying an n-gram dictionary:
  
+ You are developing a new model using a column of free text column and want to extract text features based purely on the input data. [See instructions.](#bkmk_create)
  
+ You have an existing set of text features, and want to featurize new text inputs. [See instructions.](#bkmk_read) 
  
+ You are generating scores from a predictive model and need to generate and use text inputs with an n-gram dictionary as part of the scoring process. [See instructions.](#bkmk_score)

### <a name="bkmk_create"></a> Create a new n-gram dictionary from a text column

1.  Add the **Extract N-Gram Features from Text** module to your experiment and connect the dataset that has the text you want to process.
  
2.  For **Text column**, choose a column of type **string** that contains the text you want to extract. 

    Because the results are verbose, you need to process a single column at a time.

3. For **Vocabulary mode**, select **Create** to indicate that you are creating a new list of n-gram features. 

4. For **N-Grams size**, type a number that indicates the _maximum_ size of the n-grams to extract and store. 

    For example, if you type `3`, unigrams, bigrams, and trigrams will be created.
  
5. The option, **Weighting function** specifies how to build document feature vector and how to extract vocabulary from documents.
    + **Binary Weight**: Assigns a binary presence value to the extracted n-grams.  In other words, the value for each n-gram is 1 when it exists in the given document, and 0 otherwise.  
    + **TF Weight**: Assigns a term-frequency score (**TF**) to the extracted n-grams.  The value for each n-gram is its occurrence frequency in the given document.  
    + **IDF Weight**: Assigns an inverse document frequency score (**IDF**) to the extracted n-grams.  The value for each n-gram is the log of corpus size divided by its occurrence frequency in the whole corpus. That is: `IDF = log of corpus_size / document_frequency` 
    +  **TF-IDF Weight**: Assigns a term frequency/inverse document frequency score (**TF/IDF**) to the extracted n-grams. The value for each n-gram is its TF score multiplied by its IDF score.  
  
6. For **Minimum word length**, type the minimum number of letters that can be used in any _single word_ in an n-gram.

    For example, assume the minimum word length was set to 3 (the default value), all short words like "I", "to" would be ignored. 
    
7. For **Maximum word length**, type the maximum number of letters that can be used in any _single word_ in an n-gram.
  
    By default, up to 25 characters per word or token are allowed. Words longer than that are removed, on the assumption that they are possibly sequences of arbitrary characters rather than actual lexical items.
  

8. For **Minimum n-gram document absolute frequency**, type a number that indicates the minimum occurrences required for any n-gram to be included in the n-gram dictionary. 
  
    For example, if you use the default value of 5, any n-gram must appear at least five times in the corpus to be included in the n-gram dictionary. 
  
9.  For **Maximum n-gram document ratio**, type a number that represents this ratio: the number of rows that contain a particular n-gram, over the number of rows in the overall corpus.

    For example, a ratio of 1 would indicate that, even if a specific n-gram is present in every row, the n-gram can be added to the n-gram dictionary. More typically, a word that occurs in every row would be considered a noise word and would be removed. To filter out domain-dependent noise words, try reducing this ratio.
  
    > [!IMPORTANT]
    > The rate of occurrence of particular words is not uniform, but varies from document to document. For example, if you are analyzing customer comments about a specific product, the product name might be very high frequency and close to a noise word, but be a significant term in other contexts.  


10. Select the option **Normalize n-gram feature vectors** if you want to normalize the feature vectors. When you do this, each n-gram feature vector is divided by its L2 norm.
  
    Normalization is used by default.  
  
11. Run the experiment.

    See [this section](#bkmk_results) for an explanation of the results and their format.

### <a name="bkmk_read"></a> Using an existing n-gram dictionary

1.  Add the **Extract N-Gram Features from Text** module to your experiment and connect the dataset that has the text you want to process to the **Dataset** port.
  
2.  For **Text column**, choose the text column that contains the text you want to featurize. By default, the module selects all columns of type string. For best results, process a single column at a time.

3. Add the saved dataset containing a previously generated n-gram dictionary, and connect it to the **Input vocabulary** port. You can also connect the **Result vocabulary** output of an upstream instance of the **Extract N-Gram Features from Text** module.

4. For **Vocabulary mode**, select the following update option from the drop-down list:
    
   + **ReadOnly**: Represents the input corpus in terms of the input vocabulary.  That is to say, rather than computing term frequencies from the new text dataset (on the left input), the n-gram weights from the input vocabulary are applied as is.
  
        > [!TIP]
        > Use this option when scoring a text classifier.
  

5.  For all other options, see the property descriptions in the [preceding section](#bkmk_create).

6.  Run the experiment.

    See [this section](#bkmk_results) for an explanation of the results and their format.

### <a name="bkmk_score"></a> Score or publish a model that uses n-grams  
  
1.  Copy the **Extract N-Gram Features from Text** module from the training dataflow to the scoring dataflow.  
  
2.  Connect the **Result Vocabulary** output from the training dataflow to the **Input Vocabulary** on the scoring dataflow.  
  
3.  In the scoring workflow, modify the **Extract N-Gram Features from Text** module and make these changes, leaving all else the same:  
  
    -   Set the **Vocabulary mode** parameter to **ReadOnly**.
  
4.  To publish the  experiment, save the **Result Vocabulary** as dataset.
  
     Then, connect the saved dataset to the **Extract N-Gram Features from Text** module in your scoring graph.  

## <a name="bkmk_results"></a> Results

The **Extract N-Gram Features from Text** module creates two types of output: 

+ **Results dataset**: A summary of the analyzed text together with the n-grams that were extracted. Columns that you did _not_ select in the **Text column** option are passed through to the output. For each column of text that you analyze, the module generates these columns:

  - **Matrix of n-gram occurrences**: The module generates a column for each n-gram found in the total corpus and adds a score in each column to indicate the weight of the n-gram for that row. 

+ **Result vocabulary**: The vocabulary contains the actual n-gram dictionary, together with the term frequency scores that are generated as part of the analysis.  You can save the dataset for reuse with a different set of inputs, or for later update. You can also reuse the vocabulary for modeling and scoring.

### Sample results

To illustrate how you can use the results, the following short example uses the Amazon Book Review dataset available in visual interface. The dataset was filtered to show only reviews with a score of 4 or 5, and reviews with a string length of under 300 characters. 

From this dataset, a short review was selected. Here the author's name has been replaced with `Xxx` and the book title replaced with `Yyy`, and the review was processed by the Preprocess Text Module: 

`"Xxx at his best ! ||| Yyy is one of Xxx 's best yet ! ||| I highly recommend this novel ."`

With the default settings, these n-grams were detected:  ["Xxx","his","best","Xxx_his","his_best","Yyy","one","yet","Yyy_one","one_Xxx","Xxx_best","best_yet","highly","recommend","this","novel","highly_recommend","recommend_this","this_novel"]

#### Results dataset for sample review text

For this sample, the module generated these columns:


+ **Matrix of n-gram occurrences**

    For this particular review, the results included these columns:

    | ReviewText.[manages]| ReviewText.[and\_highly]| ReviewText.[highly] |ReviewText.[highly\_recommend] |
    |----|----|----|----|
    |0|0|0.229416|0.229416|

    > [!TIP]
    > If you have trouble viewing a particular column, attach the [Select Columns in Dataset](select-columns-in-dataset.md) module to the output, and then use the search function to filter columns by name.

#### Result vocabulary for sample review text

The vocabulary contains the actual n-gram dictionary, together with the term frequency scores that are generated as part of the analysis. You can save the dataset for reuse with a different set of inputs, or for later update. The scores **DF** and **IDF** are generated regardless of other options.

+ **ID**: An identifier generated for each unique n-gram.
+ **NGram**: The n-gram. Spaces or other word separators are replaced by the underscore character.
+ **DF**: The term frequency score for the n-gram in the original corpus.
+ **IDF**: The inverse document frequency score for the n-gram in the original corpus.

It is possible to manually update this dataset; however, be careful, as you can introduce errors. For example:

+ An error is raised if the module finds duplicate rows with the same key in the input vocabulary. Be sure that no two rows in the vocabulary have the same word.
+ The input schema of the vocabulary datasets must match exactly, including column names and column types. 
+ The **ID** column and **DF** score column must be of the integer type. 
+ The **IDF** column must be of type FLOAT (floating point).


> [!Note]
 >Please DO NOT connect the output data to the Train Model Module directly. Free text columns should be removed before feeding into Train Model Module, otherwise free text columns will be treated as categorical features. Since every document is like to be different with other, this column would not be a useful feature column.
