# Evaluate from Azure AI Studio Playground 

When getting started with prompt engineering, testing different inputs one at a time to determine how effective the prompt is can be very time intensive. This is because it is important to check whether the content filters are working appropriately, whether the response is accurate, and more. 

To make this process simpler, you can utilize manual evaluation in Azure AI Studio, an evaluation tool enabling you to continuously iterate and evaluate your prompt against your test data in a single interface. You can also manually rate the outputs, the model’s responses, to help you gain confidence in your prompt.  

Manual evaluation can help you get started to understand how well your prompt is performing and iterate on your prompt to ensure you reach your desired level of confidence. 

In this article you’ll learn to: 
* Generate your manual evaluation results 
* Rate your model responses 
* Iterate on your prompt and re-evaluate 
* Save and compare results 
* Evaluate with built-in metrics 

## Prerequisites 

To generate manual evaluation results, you need to have the following ready: 

* A test dataset in one of these formats: .csv, or .jsonl. If you do not have a dataset available, we also allow you to input data manually from the UI.   

* A deployment of one of these models: GPT 3.5 models, GPT 4 models, or Davinci models. Learn more about how to create a deployment here.   

## Generate your manual evaluation results 

From the **Playground**, select **Manual evaluation** to begin the process of manually reviewing the model responses based on your test data and prompt. Your prompt is automatically transitioned to your **Manual evaluation** and now you just need to add test data to evaluate the prompt against.  

This can be done manually using the text boxes in the **Input** column. 

You can also **Import Data** to choose one of your previous existing datasets in your project or upload a dataset that is in CSV or JSONL format. After loading your data, you will be prompted to map the columns appropriately. Once you finish and select **Import**, the data will be populated appropriately in the columns below.  

> [!NOTE]
> You can add as many as 50 input rows to your manual evaluation. If your test data has more than 50 input rows, we will upload the first 50 in the input column. 
> 

Now that your data is added, you can **Run** to populate the output column with the model’s response. 

## Rate your model responses 

You can provide a thumbs up or down rating to each response to assess the prompt output. Based on the ratings you provided, you can view these response scores in the at-a-glance summaries.  

## Iterate on your prompt and re-evaluate 

Based on your summary, you may want to make changes to your prompt. You can use the prompt controls above to edit your prompt setup. This can be updating the system message, changing the model, or editing the parameters. 

After making your edits, you can choose to re-run all to update the entire table or focus on rerunning specific rows that didn’t meet your expectations the first time.  

## Save and compare results 

After populating your results, you can **Save results** to share progress with your team or to continue your manual evaluation from where you left off later.  

You can also compare the thumbs up and down ratings across your different manual evaluations by saving them and viewing them in the Evaluation tab under Manual evaluation. 

## Next steps

Learn more about how to evaluate your generative AI applications:
+ [Evaluate your collected conversation dataset](aka.ms/evaluatedata)
+ [Evaluate your generative AI flows](aka.ms/evaluateflows)
+ [Monitor your generative AI app in production](aka.ms/azureaistudiomonitoring)

Learn more about [harm mitigation techniques](aka.ms/azureaistudioharmsmitigations).