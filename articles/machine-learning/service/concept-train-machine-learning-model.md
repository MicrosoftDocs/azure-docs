
# Train machine learning models with Azure Machine Learning

Azure Machine Learning service provides several ways to train your models on a variety of resources or environments.

+ **Run configuration**: A low level method of training, which provides more flexibility and control over the training process.

    A __run configuration__ defines the environment needed to run your training script. Azure Machine Learning uses the run configuration to configure the training environment where your script runs.

    You may start with a run configuration for your local computer, and then switch to one for a cloud-based compute target as needed. Without having to change your training script for the new environment.

+ **Estimator**: A high-level abstraction that makes it easier to create run configurations. Azure Machine Learning SDK provides a generic estimator and specific ones for the following frameworks:

    + Scikit-learn
    + TensorFlow
    + Keras
    + PyTorch
    + Chainer

    For more information on using estimators, see [Create estimators in training](how-to-train-ml-models.md).

+ **Machine learning pipeline**: Optimizes your workflow with speed, portability, and reusability. The key features of ML pipelines are:

    + Unattended runs: Schedule steps to run in parallel or in sequence in a reliable and unattended manner. Perfect for long running tasks such as data preparation or long running training jobs.
    + Heterogenous compute: Use multiple ML pipelines that are reliably coordinated across heterogeneous and scalable compute resources and storage locations.
    + Reusability: Create ML pipeline templates for specific scenarios, such as training or batch scoring. Publish the pipelines as a REST endpoint and trigger via REST calls.
    + Tracking and versioning: ML pipelines can explicitly name and version your data sources, inputs, and outputs. You can also manage scripts and data separately for increased productivity.
    + Collaboration: ML pipelines allow data scientists to collaborate across all areas of the machine learning design process, while being able to concurrently work on pipeline steps.

With Azure Machine Learning service, you can train your model on a variety of resources or environments, collectively referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight or a remote virtual machine.  You can also create compute targets for model deployment as described in ["Where and how to deploy your models"](how-to-deploy-and-where.md).

You can create and manage a compute target using the Azure Machine Learning SDK, Azure portal, your workspace landing page (preview), Azure CLI or Azure Machine Learning VS Code extension. If you have compute targets that were created through another service (for example, an HDInsight cluster), you can use them by attaching them to your Azure Machine Learning service workspace.