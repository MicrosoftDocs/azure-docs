---
title: "Preprocess Text: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Preprocess Text module in Azure Machine Learning to clean and simplify text.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 09/01/2019
---
# Preprocess Text

This article describes a module in Azure Machine Learning designer (preview).

Use the **Preprocess Text** module to clean and simplify text. It supports these common text processing operations:

* Removal of stop-words
* Using regular expressions to search for and replace specific target strings
* Lemmatization, which converts multiple related words to a single canonical form
* Case normalization
* Removal of certain classes of characters, such as numbers, special characters, and sequences of repeated characters such as "aaaa"
* Identification and removal of emails and URLs

The **Preprocess Text** module currently only supports English.

## Configure Text Preprocessing  

1.  Add the **Preprocess Text** module to your pipeline in Azure Machine Learning. You can find this module under **Text Analytics**.

1. Connect a dataset that has at least one column containing text.

1. Select the language from the **Language** dropdown list.

1. **Text column to clean**: Select the column that you want to preprocess.

1. **Remove stop words**: Select this option if you want to apply a predefined stopword list to the text column. 

    Stopword lists are language-dependent and customizable.

1. **Lemmatization**: Select this option if you want words to be represented in their canonical form. This option is useful for reducing the number of unique occurrences of otherwise similar text tokens.

    The lemmatization process is highly language-dependent..

1. **Detect sentences**: Select this option if you want the module to insert a sentence boundary mark when performing analysis.

    This module uses a series of three pipe characters `|||` to represent the sentence terminator.

1. Perform optional find-and-replace operations using regular expressions.

    * **Custom regular expression**: Define the text you're searching for.
    * **Custom replacement string**: Define a single replacement value.

1. **Normalize case to lowercase**: Select this option if you want to convert ASCII uppercase characters to their lowercase forms.

    If characters aren't normalized, the same word in uppercase and lowercase letters is considered two different words.

1. You can also remove the following types of characters or character sequences from the processed output text:

    * **Remove numbers**: Select this option to remove all numeric characters for the specified language. Identification numbers are domain-dependent and language dependent. If numeric characters are an integral part of a known word, the number might not be removed.
    
    * **Remove special characters**: Use this option to remove any non-alphanumeric special characters.
    
    * **Remove duplicate characters**: Select this option to remove extra characters in any sequences that repeat for more than twice. For example, a sequence like "aaaaa" would be reduced to "aa".
    
    * **Remove email addresses**: Select this option to remove any sequence of the format `<string>@<string>`.  
    * **Remove URLs**: Select this option to remove any sequence that includes the following URL prefixes: `http`, `https`, `ftp`, `www`
    
1. **Expand verb contractions**: This option applies only to languages that use verb contractions; currently, English only. 

    For example, by selecting this option, you could replace the phrase *"wouldn't stay there"* with *"would not stay there"*.

1. **Normalize backslashes to slashes**: Select this option to map all instances of `\\` to `/`.

1. **Split tokens on special characters**: Select this option if you want to break words on characters such as `&`, `-`, and so forth. This option can also reduce the special characters when it repeats more than twice. 

    For example, the string `MS---WORD` would be separated into three tokens, `MS`, `-`, and `WORD`.

1. Run the pipeline.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 