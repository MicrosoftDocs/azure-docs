---
title: Execute Python machine learning scripts
titleSuffix: Azure Machine Learning Studio
description: Outlines design principles underlying support for Python scripts in Azure Machine Learning Studio and basic usage scenarios, capabilities, and limitations.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: ericlicoding
ms.author: amlstudiodocs
ms.custom: previous-author=heatherbshapiro, previous-ms.author=hshapiro
ms.date: 03/05/2019
---
# Execute Python machine learning scripts in Azure Machine Learning Studio

This article describes the design principles underlying current support for Python scripts in Azure Machine Learning Studio.

Python is used in all stages of a typical machine learning workflow:

- Data ingest and processing
- Feature construction
- Model training
- Model validation
- Deployment of the models

Studio supports embedding Python scripts into various parts of a machine learning experiment and also seamlessly publishing them as web services.

## Design principles of Python execution in Studio

The primary interface to Python in Studio is through the [Execute Python Script][execute-python-script].

![Execute Python Script module](./media/execute-python-scripts/execute-machine-learning-python-scripts-module.png)

![Execute Python Script code stub](./media/execute-python-scripts/embedded-machine-learning-python-script.png)

The [Execute Python Script][execute-python-script] module in Studio accepts up to three inputs and produces up to two outputs, like its R analog, the [Execute R Script][execute-r-script] module. The Python code is entered into the parameter box as a specially named entry-point function called `azureml_main`. Here are the key design principles used to implement this module:

1. Must be idiomatic for Python users

    Most Python users factor their code as functions inside modules. So putting many executable statements in a top-level module is relatively rare. As a result, the script box also takes a specially named Python function as opposed to just a sequence of statements. The objects exposed in the function are standard Python library types such as [Pandas](http://pandas.pydata.org/) data frames and [NumPy](http://www.numpy.org/) arrays.

1. Must have high-fidelity between local and cloud executions

    The backend used to execute the Python code is based on [Anaconda](https://store.continuum.io/cshop/anaconda/), a widely used cross-platform scientific Python distribution. It comes with close to 200 of the most common Python packages. Therefore, data scientists can debug and qualify their code on their local Azure Machine Learning Studio-compatible Anaconda environment. Then use an existing development environment, such as [IPython](http://ipython.org/) notebook or [Python Tools for Visual Studio](https://aka.ms/ptvs), to run it as part of a Studio experiment. The `azureml_main` entry point is a vanilla Python function, so it can be authored without Studio-specific code.

1. Must be seamlessly composable with other Azure Machine Learning Studio modules

    The [Execute Python Script][execute-python-script] module accepts, as inputs and outputs, standard Studio datasets. The underlying framework transparently and efficiently bridges Studio and Python runtimes. As a result, Python can be used in conjunction with existing Studio workflows, including workflows that call into R and SQLite. Data scientist could compose workflows that combine the benefits of multiple languages including Python, SQL, and R.

<<<<<<< HEAD
## Mapping input ports to Python code
=======
The [Execute Python Script][execute-python-script] module in Azure ML Studio accepts up to three inputs and produces up to two outputs (discussed in the following section), like its R analog, the [Execute R Script][execute-r-script] module. The Python code to be executed is entered into the parameter box as a specially named entry-point function called `azureml_main`. Here are the key design principles used to implement this module:
>>>>>>> 0b526b8f33048f3c883dc9644e14227ef1d2342b

Inputs to the Python module are exposed as Pandas data frames. The function must return a single Pandas data frame packaged inside of a Python [sequence](https://docs.python.org/2/c-api/sequence.html) such as a tuple, list, or NumPy array. The first element of this sequence is then returned in the first output port of the module. This scheme is shown below.

![Mapping input ports to parameters and return value to output port](./media/execute-python-scripts/map-of-python-script-inputs-outputs.png)

More detailed semantics of how the input ports get mapped to parameters of the `azureml_main` function are shown in the following table:

![Table of input port configurations and resulting Python signature](./media/execute-python-scripts/python-script-inputs-mapped-to-parameters.png)

The mapping between input ports and function parameters is positional:

- The first connected input port is mapped to the first parameter of the function.
- The second input (if connected) is mapped to the second parameter of the function.

## Translation of input and output types

- Input datasets in Studio are converted to data frames in Pandas. Output data frames are converted back to Studio datasets.
- String and numeric columns are converted as-is
- Missing values in a dataset are converted to ‘NA’ values in Pandas. The same conversion happens on the way back (NA values in Pandas are converted to missing values in Studio).
- Index vectors in Pandas are not supported in Studio. All input data frames in the Python function always have a 64-bit numerical index from 0 to the number of rows minus 1.
- Studio datasets cannot have duplicate column names and column names that are not strings. If an output data frame contains non-numeric columns, the framework calls `str` on the column names. Likewise, any duplicate column names are automatically mangled to insure the names are unique. The suffix (2) is added to the first duplicate, (3) to the second duplicate, and so on.

## Operationalizing Python scripts

Any [Execute Python Script][execute-python-script] modules used in a scoring experiment are called when published as a web service. For example, the image below shows a scoring experiment that contains the code to evaluate a single Python expression.

![Studio workspace for a web service](./media/execute-python-scripts/figure3a.png)

![Python Pandas expression](./media/execute-python-scripts/python-script-with-python-pandas.png)

A web service created from this experiment would do the following:

1. Take a Python expression as input (as a string)
1. Send the Python expression to the Python interpreter
1. Returns a table containing both the expression and the evaluated result.

## Importing existing Python script modules

A common use-case is to incorporate existing Python scripts into Studio experiments. The [Execute Python Script][execute-python-script] module accepts a zip file that contains Python modules at the third input port. The file is unzipped by the execution framework at runtime and the contents are added to the library path of the Python interpreter. The `azureml_main` entry point function can then import these modules directly.

As an example, consider the file Hello.py containing a simple “Hello, World” function.

![User-defined function in Hello.py file](./media/execute-python-scripts/figure4.png)

Next, we create a file Hello.zip that contains Hello.py:

![Zip file containing user-defined Python code](./media/execute-python-scripts/figure5.png)

Upload the zip file as a dataset into Studio. Then create and run an experiment that uses the Python code in the Hello.zip file by attaching it to the third input port of the **Execute Python Script** module as shown in the following image.

![Sample experiment with Hello.zip as an input to an Execute Python Script module](./media/execute-python-scripts/figure6a.png)

![User-defined Python code uploaded as a zip file](./media/execute-python-scripts/figure6b.png)

The module output shows that the zip file has been unpackaged and that the function `print_hello` has been run.

![Module output showing user-defined function](./media/execute-python-scripts/figure7.png)

## Working with visualizations

Plots created using MatplotLib can be returned by the [Execute Python Script][execute-python-script]. However, plots are not automatically redirected to images as they are when using R. So the user must explicitly save any plots to PNG files.

To generate images from MatplotLib, you must take the following steps:

1. Switch the backend to “AGG” from the default Qt-based renderer
1. Create a new figure object
1. Get the axis and generate all plots into it
1. Save the figure to a PNG file

This process is illustrated in the following images that create a scatter plot matrix using the scatter_matrix function in Pandas.

![Code to save MatplotLib figures to images](./media/execute-python-scripts/figure-v1-8.png)

![Click visualize on an Execute Python Script module to view the figures](./media/execute-python-scripts/figure-v2-9a.png)

![Visualizing plots for a sample experiment using Python code](./media/execute-python-scripts/figure-v2-9b.png)

It's possible to return multiple figures by saving them into different images. The Studio runtime picks up all images and concatenates them for visualization.

## Advanced examples

The Anaconda environment installed in Studio contains common packages such as NumPy, SciPy, and Scikits-Learn. These packages can be effectively used for data processing in a machine learning pipeline.

For example, the following experiment and script illustrate the use of ensemble learners in Scikits-Learn to compute feature importance scores for a dataset. The scores can be used to perform supervised feature selection before being fed into another model.

Here is the Python function used to compute the importance scores and order the features based on the scores:

![Function to rank features by scores](./media/execute-python-scripts/figure8.png)

The following experiment then computes and returns the importance scores of features in the “Pima Indian Diabetes” dataset in Azure Machine Learning Studio:

![Experiment to rank features in the Pima Indian Diabetes dataset using Python](./media/execute-python-scripts/figure9a.png)

![Visualization of the output of the Execute Python Script module](./media/execute-python-scripts/figure9b.png)

## Limitations

The [Execute Python Script][execute-python-script] currently has the following limitations:

### Sandboxed execution

The Python runtime is currently sandboxed and, as a result, does not allow access to the network or to the local file system in a persistent manner. All files saved locally are isolated and deleted once the module finishes. The Python code cannot access most directories on the machine it runs on, the exception being the current directory and its subdirectories.

### Lack of sophisticated development and debugging support

The Python module currently does not support IDE features such as intellisense and debugging. Also, if the module fails at runtime, the full Python stack trace is available. But it must be viewed in the output log for the module. We currently recommend that you develop and debug Python scripts in an environment such as IPython and then import the code into the module.

### Single data frame output

The Python entry point is only permitted to return a single data frame as output. It is not currently possible to return arbitrary Python objects such as trained models directly back to the Studio runtime. Like [Execute R Script][execute-r-script], which has the same limitation, it is possible in many cases to pickle objects into a byte array and then return that inside of a data frame.

### Inability to customize Python installation

Currently, the only way to add custom Python modules is via the zip file mechanism described earlier. While this is feasible for small modules, it is cumbersome for large modules (especially modules with native DLLs) or a large number of modules.

## Conclusions

The [Execute Python Script][execute-python-script] module allows data scientists to incorporate existing Python code into Studio workflows and to seamlessly operationalize them as part of a web service. The Python script module joins naturally with other modules in Studio. The module can be used for a range of tasks from data exploration to pre-processing and feature extraction, and then to evaluation and post-processing of the results. The backend runtime used for execution is based on Anaconda, a well-tested, and widely used Python distribution. This backend makes it simple for you to on-board existing code assets into the cloud.

We expect to provide additional functionality to the [Execute Python Script][execute-python-script] module such as the ability to train and operationalize models in Python and to add better support for the development and debugging code in Azure Machine Learning Studio.

## Next steps

For more information, see the [Python Developer Center.](https://azure.microsoft.com/develop/python/)

<!-- Module References -->
[execute-python-script]: https://docs.microsoft.com/azure/machine-learning/studio-module-reference/execute-python-script
[execute-r-script]: https://docs.microsoft.com/azure/machine-learning/studio-module-reference/execute-r-script
