---
title: "Tutorial: Train your first machine learning model - Python"
titleSuffix: Azure Machine Learning
description: Part 3 of the Azure Machine Learning get-started series shows how to train a machine learning model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 02/11/2021
ms.custom: devx-track-python
---

# Tutorial: Train your first machine learning model (part 3 of 4)

This tutorial shows you how to train a machine learning model in Azure Machine Learning.

This tutorial is *part 3 of a four-part tutorial series* in which you learn the fundamentals of Azure Machine Learning and complete jobs-based machine learning tasks in Azure. This tutorial builds on the work that you completed in [Part 1: Set up](tutorial-1st-experiment-sdk-setup-local.md) and [Part 2: Run "Hello world!"](tutorial-1st-experiment-hello-world.md) of the series.

In this tutorial, you take the next step by submitting a script that trains a machine learning model. This example will help you understand how Azure Machine Learning eases consistent behavior between local debugging and remote runs.

In this tutorial, you:

> [!div class="checklist"]
> * Create a training script.
> * Use Conda to define an Azure Machine Learning environment.
> * Create a control script.
> * Understand Azure Machine Learning classes (`Environment`, `Run`, `Metrics`).
> * Submit and run your training script.
> * View your code output in the cloud.
> * Log metrics to Azure Machine Learning.
> * View your metrics in the cloud.

## Prerequisites

- [Anaconda](https://www.anaconda.com/download/) or [Miniconda](https://www.anaconda.com/download/) to manage Python virtual environments and install packages.
- Completion of [part1](tutorial-1st-experiment-sdk-setup-local.md) and [part 2](tutorial-1st-experiment-hello-world.md) of the series.

## Create training scripts

First you define the neural network architecture in a `model.py` file. All your training code will go into the `src` subdirectory, including `model.py`.

The following code is taken from [this introductory example](https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html) from PyTorch. Note that the Azure Machine Learning concepts apply to any machine learning code, not just PyTorch.

:::code language="python" source="~/MachineLearningNotebooks/tutorials/get-started-day1/IDE-users/src/model.py":::

Next you define the training script. This script downloads the CIFAR10 dataset by using PyTorch `torchvision.dataset` APIs, sets up the network defined in `model.py`, and trains it for two epochs by using standard SGD and cross-entropy loss.

Create a `train.py` script in the `src` subdirectory:

:::code language="python" source="~/MachineLearningNotebooks/tutorials/get-started-day1/IDE-users/src/train.py":::

You now have the following directory structure:

:::image type="content" source="media/tutorial-1st-experiment-sdk-train/directory-structure.png" alt-text="Directory structure shows train.py in src subdirectory":::


> [!div class="nextstepaction"]
> [I created the training scripts](?success=create-scripts#environment) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=create-scripts)

## <a name="environment"></a> Create a new Python environment

Create a file called `pytorch-env.yml` in the `.azureml` hidden directory:

:::code language="yml" source="~/MachineLearningNotebooks/tutorials/get-started-day1/IDE-users/environments/pytorch-env.yml":::

This environment has all the dependencies that your model and training script require. Notice there's no dependency on the Azure Machine Learning SDK for Python.

> [!div class="nextstepaction"]
> [I created the environment file](?success=create-env-file#test-local) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=create-env-file)

## <a name="test-local"></a> Test locally

In a terminal or Anaconda Prompt window, use the following code to test your script locally in the new environment.  

```bash
conda deactivate                                # If you are still using the tutorial environment, exit it
conda env create -f .azureml/pytorch-env.yml    # create the new Conda environment
conda activate pytorch-env                      # activate new Conda environment
python src/train.py                             # train model
```

After you run this script, you'll see the data downloaded into a directory called `tutorial/data`.

> [!div class="nextstepaction"]
> [I ran the code locally](?success=test-local#create-local) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=test-local)

## <a name="create-local"></a> Create the control script

The difference between the following control script and the one that you used to submit "Hello world!" is that you add a couple of extra lines to set the environment.

Create a new Python file in the `tutorial` directory called `04-run-pytorch.py`:

```python
# 04-run-pytorch.py
from azureml.core import Workspace
from azureml.core import Experiment
from azureml.core import Environment
from azureml.core import ScriptRunConfig

if __name__ == "__main__":
    ws = Workspace.from_config()
    experiment = Experiment(workspace=ws, name='day1-experiment-train')
    config = ScriptRunConfig(source_directory='./src',
                             script='train.py',
                             compute_target='cpu-cluster')

    # set up pytorch environment
    env = Environment.from_conda_specification(
        name='pytorch-env',
        file_path='./.azureml/pytorch-env.yml'
    )
    config.run_config.environment = env

    run = experiment.submit(config)

    aml_url = run.get_portal_url()
    print(aml_url)
```    
    
### Understand the code changes

:::row:::
   :::column span="":::
      `env = ...`
   :::column-end:::
   :::column span="2":::
      Azure Machine Learning provides the concept of an [environment](/python/api/azureml-core/azureml.core.environment.environment) to represent a reproducible, versioned Python environment for running experiments. It's easy to create an environment from a local Conda or pip environment.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `config.run_config.environment = env`
   :::column-end:::
   :::column span="2":::
      Adds the environment to [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig).
   :::column-end:::
:::row-end:::

> [!div class="nextstepaction"]
> [I created the control script](?success=control-script#submit) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=control-script)


## <a name="submit"></a> Submit the run to Azure Machine Learning

Switch back to the *tutorial* environment that has the Azure Machine Learning SDK for Python installed. Since the training code isn't running on your computer, you don't need to have PyTorch installed.  But you do need the `azureml-sdk`, which is in the *tutorial* environment.

```bash
conda deactivate
conda activate tutorial
python 04-run-pytorch.py
```

>[!NOTE] 
> The first time you run this script, Azure Machine Learning will build a new Docker image from your PyTorch environment. The whole run might take 5 to 10 minutes to complete. 
>
> You can see the Docker build logs in the Azure Machine Learning studio. Follow the link to the studio, select the **Outputs + logs** tab, and then select `20_image_build_log.txt`.
>
> This image will be reused in future runs to make them run much quicker.

After your image is built, select `70_driver_log.txt` to see the output of your training script.

```txt
Downloading https://www.cs.toronto.edu/~kriz/cifar-10-python.tar.gz to ./data/cifar-10-python.tar.gz
...
Files already downloaded and verified
epoch=1, batch= 2000: loss 2.19
epoch=1, batch= 4000: loss 1.82
epoch=1, batch= 6000: loss 1.66
epoch=1, batch= 8000: loss 1.58
epoch=1, batch=10000: loss 1.52
epoch=1, batch=12000: loss 1.47
epoch=2, batch= 2000: loss 1.39
epoch=2, batch= 4000: loss 1.38
epoch=2, batch= 6000: loss 1.37
epoch=2, batch= 8000: loss 1.33
epoch=2, batch=10000: loss 1.31
epoch=2, batch=12000: loss 1.27
Finished Training
```

> [!WARNING]
> If you see an error `Your total snapshot size exceeds the limit`, the `data` directory is located in the `source_directory` value used in `ScriptRunConfig`.
>
> Move `data` outside `src`.

Environments can be registered to a workspace with `env.register(ws)`. They can then be easily shared, reused, and versioned. Environments make it easy to reproduce previous results and to collaborate with your team.

Azure Machine Learning also maintains a collection of curated environments. These environments cover common machine learning scenarios and are backed by cached Docker images. Cached Docker images make the first remote run faster.

In short, using registered environments can save you time! Read [How to use environments](./how-to-use-environments.md) for more information.

> [!div class="nextstepaction"]
> [I submitted the run](?success=test-w-environment#log) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=test-w-environment)

## <a name="log"></a> Log training metrics

Now that you have a model training in Azure Machine Learning, start tracking some performance metrics.

The current training script prints metrics to the terminal. Azure Machine Learning provides a mechanism for logging metrics with more functionality. By adding a few lines of code, you gain the ability to visualize metrics in the studio and to compare metrics between multiple runs.

### Modify `train.py` to include logging

Modify your `train.py` script to include two more lines of code:

:::code language="python" source="~/MachineLearningNotebooks/tutorials/get-started-day1/code/pytorch-cifar10-train-with-logging/train.py":::


#### Understand the additional two lines of code

In `train.py`, you access the run object from _within_ the training script itself by using the `Run.get_context()` method and use it to log metrics:

```python
# in train.py
run = Run.get_context()

...

run.log('loss', loss)
```

Metrics in Azure Machine Learning are:

- Organized by experiment and run, so it's easy to keep track of and
compare metrics.
- Equipped with a UI so you can visualize training performance in the studio.
- Designed to scale, so you keep these benefits even as you run hundreds of experiments.

> [!div class="nextstepaction"]
> [I modified train.py ](?success=modify-train#log) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=modify-train)

### Update the Conda environment file

The `train.py` script just took a new dependency on `azureml.core`. Update `pytorch-env.yml` to reflect this change:

:::code language="python" source="~/MachineLearningNotebooks/tutorials/get-started-day1/configuration/pytorch-aml-env.yml":::

> [!div class="nextstepaction"]
> [I updated the environment file](?success=update-environment#submit-again) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=update-environment)

### <a name="submit-again"></a> Submit the run to Azure Machine Learning
Submit this script once more:

```bash
python 04-run-pytorch.py
```

This time when you visit the studio, go to the **Metrics** tab where you can now see live updates on the model training loss!

:::image type="content" source="media/tutorial-1st-experiment-sdk-train/logging-metrics.png" alt-text="Training loss graph on the Metrics tab.":::

> [!div class="nextstepaction"]
> [I resubmitted the run](?success=resubmit-with-logging#next-steps) [I ran into an issue](https://www.research.net/r/7CTJQQN?issue=resubmit-with-logging)

## Next steps

In this session, you upgraded from a basic "Hello world!" script to a more realistic training script that required a specific Python environment to run. You saw how to take a local Conda environment to the cloud with Azure Machine Learning environments. Finally, you
saw how in a few lines of code you can log metrics to Azure Machine Learning.

There are other ways to create Azure Machine Learning environments, including [from a pip requirements.txt](/python/api/azureml-core/azureml.core.environment.environment#from-pip-requirements-name--file-path-) file or [from an existing local Conda environment](/python/api/azureml-core/azureml.core.environment.environment#from-existing-conda-environment-name--conda-environment-name-).

In the next session, you'll see how to work with data in Azure Machine Learning by uploading the CIFAR10 dataset to Azure.

> [!div class="nextstepaction"]
> [Tutorial: Bring your own data](tutorial-1st-experiment-bring-data.md)

>[!NOTE] 
> If you want to finish the tutorial series here and not progress to the next step, remember to [clean up your resources](tutorial-1st-experiment-bring-data.md#clean-up-resources).
