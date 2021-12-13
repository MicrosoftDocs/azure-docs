---
title: "Score Vowpal Wabbit Model"
titleSuffix: Azure Machine Learning
description: Learn how to use the Score Vowpal Wabbit Model component to generate scores for a set of input data, using an existing trained Vowpal Wabbit model.  
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 07/02/2020
---
# Score Vowpal Wabbit Model
This article describes how to use the **Score Vowpal Wabbit Model** component in Azure Machine Learning designer, to generate scores for a set of input data, using an existing trained Vowpal Wabbit model.  

This component provides the latest version of the Vowpal Wabbit framework, version 8.8.1. Use this component to score data using a trained model saved in the VW version 8 format.  

## How to configure Score Vowpal Wabbit Model

1.  Add the **Score Vowpal Wabbit Model** component to your experiment.  
  
2.  Add a trained Vowpal Wabbit model and connect it to the left-hand input port. You can use a trained model created in the same experiment, or locate a saved model in the **Datasets** category of designer’s left navigation pane. However, the model must be available in Azure Machine Learning Designer.  
  
    > [!NOTE]
    > Only Vowpal Wabbit 8.8.1 models are supported; you cannot connect saved models that were trained by using other algorithms.
  
3.  Add the test dataset and connect it to right-hand input port. If test dataset is a directory, which contains the test data file, specify the test data file name with **Name of the test data file**. If test dataset is a single file, leave **Name of the test data file** to be empty.

4. In the **VW arguments** text box, type a set of valid command-line arguments to the Vowpal Wabbit executable.  

    For information about which Vowpal Wabbit arguments are supported and unsupported in Azure Machine Learning, see the [Technical Notes](#technical-notes) section.  

5.  **Name of the test data file**: Type the name of the file that contains the input data. This argument is only used when the test dataset is a directory.

6. **Specify file type**: Indicate which format your training data uses. Vowpal Wabbit supports these two input file formats:  

   - **VW** represents the internal format used by  Vowpal Wabbit . See the [Vowpal Wabbit wiki page](https://github.com/JohnLangford/vowpal_wabbit/wiki/Input-format) for details. 
   - **SVMLight** is a format used by some other machine learning tools. 

7. Select the option, **Include an extra column containing labels**, if you want to output labels together with the scores.  

   Typically, when handling text data, Vowpal Wabbit does not require labels, and will return only the scores for each row of data.  

8. Select the option, **Include an extra column containing raw scores**, if you want to output raw scores  together with the results.  

9. Submit the pipeline.

## Results

After training is complete:

+ To visualize the results, right-click the output of the [Score Vowpal Wabbit Model](score-vowpal-wabbit-model.md) component. The output indicates a prediction score normalized from 0 to 1. 

+ To evaluate the results, the output dataset should contain specific score column names, which meet Evaluate Model component requirements.

  + For regression task, the dataset to evaluate must has one column, named `Regression Scored Labels`, which represents scored labels.
  + For binary classification task, the dataset to evaluate must has two columns, named `Binary Class Scored Labels`,`Binary Class Scored Probabilities`, which represent scored labels, and probabilities respectively.
  + For multi classification task, the dataset to evaluate must has one column, named `Multi Class Scored Labels`, which represents scored labels.

  Note that the results of the Score Vowpal Wabbit Model component cannot be evaluated directly. Before evaluating, the dataset should be modified according to the requirements above.

##  Technical notes

This section contains implementation details, tips, and answers to frequently asked questions.

### Parameters

Vowpal Wabbit has many command-line options for choosing and tuning algorithms. A full discussion of these options is not possible here; we recommend that you view the [Vowpal Wabbit wiki page](https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments).  

The following parameters are not supported in Azure Machine Learning Studio (classic).  

-   The input/output options specified in [https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments](https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments)  
  
     These properties are already configured automatically by the component.  
  
-   Additionally, any option that generates multiple outputs or takes multiple inputs is disallowed. These include *`--cbt`*, *`--lda`*, and *`--wap`*.  
  
-   Only supervised learning algorithms are supported. This disallows these options: *`–active`*, `--rank`, *`--search`* etc.  

All arguments other than those described above are allowed.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 