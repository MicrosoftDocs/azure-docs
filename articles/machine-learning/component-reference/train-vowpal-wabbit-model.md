---
title: "Train Vowpal Wabbit Model"
titleSuffix: Azure Machine Learning
description: Learn how to use the Train Vowpal Wabbit Model component to create a machine learning model by using an instance of Vowpal Wabbit.
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 07/02/2020
---

# Train Vowpal Wabbit Model
This article describes how to use the **Train Vowpal Wabbit Model** component in Azure Machine Learning designer, to create a machine learning model by using Vowpal Wabbit.  

To use Vowpal Wabbit for machine learning, format your input according to Vowpal Wabbit requirements, and prepare the data in the required format. Use this component to specify Vowpal Wabbit command-line arguments. 

When the pipeline is run, an instance of Vowpal Wabbit is loaded into the experiment run-time, together with the specified data. When training is complete, the model is serialized back to the workspace. You can use the model immediately to score data. 

To incrementally train an existing model on new data, connect a saved model to the **Pre-trained Vowpal Wabbit model** input port of **Train Vowpal Wabbit Model**, and add the new data to the other input port.  

## What is Vowpal Wabbit?  

Vowpal Wabbit (VW) is a fast, parallel machine learning framework that was developed for distributed computing by Yahoo! Research. Later it was ported to Windows and adapted by John Langford (Microsoft Research) for scientific computing in parallel architectures.  

Features of Vowpal Wabbit that are important for machine learning include continuous learning (online learning), dimensionality reduction, and interactive learning. Vowpal Wabbit is also a solution for problems when you cannot fit the model data into memory.  

The primary users of Vowpal Wabbit are data scientists who have previously used the framework for machine learning tasks such as classification, regression, topic modeling or matrix factorization. The Azure wrapper for Vowpal Wabbit has very similar performance characteristics to the on-premises version, so you can use the powerful features and native performance of Vowpal Wabbit, and easily publish the trained model as an operationalized service.  

The [Feature Hashing](feature-hashing.md) component also includes functionality provided by Vowpal Wabbit, that lets you transform text datasets into binary features using a hashing algorithm.  

## How to configure Vowpal Wabbit Model  

This section describes how to train a new model, and how to add new data to an existing model.

Unlike other components in designer, this component both specifies the component parameters, and trains the model. If you have an existing model, you can add it as an optional input, to incrementally train the model.

+ [Prepare input data in one of the required formats](#prepare-the-input-data)
+ [Train a new model](#create-and-train-a-vowpal-wabbit-model)
+ [Incrementally train an existing model](#retrain-an-existing-vowpal-wabbit-model)

### Prepare the input data

To train a model using this component, the input dataset must consist of a single text column in one of the two supported formats: **SVMLight** or **VW**. This doesn't mean that Vowpal Wabbit analyzes only text data, only that the features and values must be prepared in the required text file format.  

The data can be read from two kinds of datasets, file dataset or tabular dataset. Both of these datasets must either in SVMLight or VW format. The Vowpal Wabbit data format has the advantage that it does not require a columnar format, which saves space when dealing with sparse data. For more information about this format, see the [Vowpal Wabbit wiki page](https://github.com/JohnLangford/vowpal_wabbit/wiki/Input-format).  

### Create and train a Vowpal Wabbit model

1. Add the **Train Vowpal Wabbit Model** component to your experiment. 
  
2. Add the training dataset and connect it to **Training data**. If training dataset is a directory, which contains the training data file, specify the training data file name with **Name of the training data file**. If training dataset is a single file, leave **Name of the training data file** to be empty.

3. In the **VW arguments** text box, type the command-line arguments for the Vowpal Wabbit executable.

     For example, you might add *`–l`* to specify the learning rate, or *`-b`* to indicate the number of hashing bits.  

     For more information, see the [Vowpal Wabbit parameters](#supported-and-unsupported-parameters) section.  

4. **Name of the training data file**: Type the name of the file that contains the input data. This argument is only used when the training dataset is a directory.

5. **Specify file type**: Indicate which format your training data uses. Vowpal Wabbit supports these two input file formats:  

    - **VW** represents the internal format used by  Vowpal Wabbit . See the [Vowpal Wabbit wiki page](https://github.com/JohnLangford/vowpal_wabbit/wiki/Input-format) for details. 
    - **SVMLight** is a format used by some other machine learning tools. 

6. **Output readable model file**: select the option if you want the component to save the readable model to the job records. This argument corresponds to the `--readable_model` parameter in the VW command line.  

7. **Output inverted hash file**: select the option if you want the component to save the inverted hashing function to one file in the job records. This argument corresponds to the `--invert_hash` parameter in the VW command line.  

8. Submit the pipeline.

### Retrain an existing Vowpal Wabbit model

Vowpal Wabbit supports incremental training by adding new data to an existing model. There are two ways to get an existing model for retraining:

+ Use the output of another **Train Vowpal Wabbit Model** component in the same pipeline.  
  
+ Locate a saved model in the **Datasets** category of designer’s left navigation pane, and drag it in to your pipeline.  

1. Add the **Train Vowpal Wabbit Model** component to your pipeline.  
2. Connect the previously trained model to the **Pre-trained Vowpal Wabbit Model** input port of the component.
3. Connect the new training data to the **Training data** input port of the component.
4. In the parameters pane of **Train Vowpal Wabbit Model**, specify the format of the new training data, and also the training data file name if the input dataset is a directory.
5. Select the **Output readable model file** and **Output inverted hash file** options if the corresponding files need to be saved in the job records.

6. Submit the pipeline.  
7. Select the component and select **Register dataset** under **Outputs+logs** tab in the right pane, to preserve the updated model in your Azure Machine Learning workspace.  If you don't specify a new name, the updated model overwrites the existing saved model.

## Results

+ To generate scores from the model, use [Score Vowpal Wabbit Model](score-vowpal-wabbit-model.md).

> [!NOTE]
> If you need to deploy the trained model in the designer, make sure that [Score Vowpal Wabbit Model](score-vowpal-wabbit-model.md) instead of **Score Model** is connected to the input of [Web Service Output component](web-service-input-output.md) in the inference pipeline.

## Technical notes

This section contains implementation details, tips, and answers to frequently asked questions.

### Advantages of Vowpal Wabbit

Vowpal Wabbit provides extremely fast learning over non-linear features like n-grams.  

Vowpal Wabbit uses *online learning* techniques such as stochastic gradient descent (SGD) to fit a model one record at a time. Thus it iterates very quickly over raw data and can develop a good predictor faster than most other models. This approach also avoids having to read all training data into memory.  

Vowpal Wabbit converts all data to hashes, not just text data but other categorical variables. Using hashes makes lookup of regression weights more efficient, which is critical for effective stochastic gradient descent.  

###  Supported and unsupported parameters 

This section describes support for Vowpal Wabbit command line parameters in Azure Machine Learning designer. 

Generally, all but a limited set of arguments are supported. For a complete list of arguments, use the [Vowpal Wabbit wiki page](https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments).    

The following parameters are not supported:

-   The input/output options specified in [https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments](https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments)  
  
     These properties are already configured automatically by the component.  
  
-   Additionally, any option that generates multiple outputs or takes multiple inputs is disallowed. These include *`--cbt`*, *`--lda`*, and *`--wap`*.  
  
-   Only supervised learning algorithms are supported. Therefore, these options are not supported: *`–active`*, `--rank`, *`--search`* etc. 

### Restrictions

Because the goal of the service is to support experienced users of Vowpal Wabbit, input data must be prepared ahead of time using the Vowpal Wabbit native text format, rather than the dataset format used by other components.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 
