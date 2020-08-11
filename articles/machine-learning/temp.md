


## What's an estimator?

To facilitate model training using popular frameworks, the Azure Machine Learning Python SDK provides an alternative higher-level abstraction, the estimator class.  This class allows you to easily construct run configurations. You can create and use a generic [Estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator?view=azure-ml-py) to submit training scripts that use any learning framework you choose (such as scikit-learn). We recommend using an estimator for training as it automatically constructs embedded objects like an environment or RunConfiguration objects for you. If you wish to have more control over how these objects are created and specify what packages to install for your experiment run, follow [these steps](#amlcompute) to submit your training experiments using a RunConfiguration object on an Azure Machine Learning Compute.

Azure Machine Learning provides specific estimators for [PyTorch](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.pytorch?view=azure-ml-py), [TensorFlow](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py), [Chainer](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py), and [Ray RLlib](how-to-use-reinforcement-learning.md).

For more information, see [Train ML Models with estimators](how-to-train-ml-models.md).


    - name: Create compute resources
      items: 
        - name: Use studio
          href: how-to-create-attach-compute-studio.md
        - name: Use Python SDK
          href: how-to-create-attach-compute-sdk.md