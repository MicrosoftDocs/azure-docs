# Web Service Input/Output

This article describes **Web Service Input** module and **Web Service Output** module in Azure Machine Learning designer (preview).

**Web Service Input** module can only connect to input port with type **DataFrameDirectory**. And **Web Service Output** module can only be connected from output port with type **DataFrameDirectory**. The two modules can be found in the module tree, under **Web Service** category. 

**Web Service Input** module is used to indicate where user data enters the pipeline and **Web Service Output** module is used to indicate where user data is returned in a Real-time inference Pipeline.

## How to use Web Service Input/Output

1. When you create a real-time inference pipeline from your training pipeline, **Web Service Input** and **Web Service Output** module will be automatically added to show where user data enters the pipeline and where data is returned. 

   Learn more about [create a real-time inference pipeline](https://docs.microsoft.com/en-us/azure/machine-learning/tutorial-designer-automobile-price-deploy#create-a-real-time-inference-pipeline).

   > Note:
   >
   > Automatically generating real-time inference pipeline is a rule-based best-effort process, there is no guarantee for the correctness. You can manually add or remove **Web Service Input/Output** modules to satisfy your requirements. Make sure there is at least one **Web Service Input** module and one **Web Service Output** module in your real-time inference pipeline. If you have multiple **Web Service Input** or **Web Service Output** modules, make sure they have unique names, which you can input the name in the right panel of the module.

2. You can also manually create a real-time inference pipeline by adding **Web Service Input** and **Web Service Output** modules to your unsubmitted pipeline.

   > Note:
   >
   > The pipeline type will be determined at the first time you submit it. So be sure to add **Web Service Input** and **Web Service Output** module before you submit for the first time if you want to create a real-time inference pipeline.

   Below example shows how to manually create real-time inference pipeline from **Execute Python Script** module. 

   ![Example](media/module/web-service-input-output-example.png)
   
   After you submit the pipeline and the run completes successfully, you will be able to deploy the real-time endpoint.
   
   > Note:
   >
   > In the above example, **Enter Data Manually** provides the data schema for web service input and is necessary for deploying the real-time endpoint. Generally, you should always connect a module or dataset to the port which **Web Service Input** is connected to provide the data schema.
   
## Next steps
Learn more about [deploy the real-time endpoint](https://docs.microsoft.com/en-us/azure/machine-learning/tutorial-designer-automobile-price-deploy#deploy-the-real-time-endpoint).
See the [set of modules available](module-reference.md) to Azure Machine Learning.