# Custom entity recognition

## Project

A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and other people who have contributor access to the Azure resource you are using.
As a prerequisite to creating a Custom entity extraction project, you have to connect your resource to  a storage account. You can learn more about this [here](../ct-before-get-started.md#Set-storage-account).
As part of the project creation flow, you need connect it to a blob container where you have uploaded your dataset. Your project automatically includes all the `.txt` files available in your container.
You can learn more about limits [here](ct-reference-limits.md).

Within your project you can do the following operations:

* **Tag your data**: this is the process of tagging your data so that when you train your model it learns what you want to extract. You can learn more about tagging your data [here](ct-how-to-tag-data.md).
* **Build and train your model**: this is the core step of your project. In this step your model starts learning from your tagged data. You can learn more about training your model [here](ct-how-to-train-model.md).
* **View model evaluation details**: this is where you review your model performance to decide if there is room for improvement or you are satisfied with the results. You can learn more about model evaluation [here](ct-how-to-view-model-evaluation.md).
* **Improve model**: this where you know what went wrong with your model and how to improve performance. You can learn more about improving your model [here](ct-how-to-improve-model.md).
* **Deploy model**: this is where you make your model available for use. You can learn more about deploying your model [here](ct-how-to-deploy-model.md).
* **Test model**: this is where you can test your model.You can learn more about testing your model [here](ct-how-to-test-model.md).

## Model

A model is an object that has been trained to do a certain task, in our case custom entity extraction.<br>
**Model training** is the process of teaching your model what to extract based on your tagged data.<br>
**Model evaluation** is the process that happens right after training to know how well does your model perform.<br>
**Model deployment** is the process of making it available for use.

## Entity

An entity is a span of text that indicates a certain type/information. The text span can consist of one or more words/tokens. In scope of custom text extraction, entities represents the information that the user wants to extract from the text. Below are some illustrative examples:

| Text | Entity name/type | Entity |
| -- | -- | -- |
| John borrowed 25,000 USD from Fred | Borrower Name | `John` |
| John borrowed 25,000 USD from Fred | Lender Name | `Fred` |
| John borrowed 25,000 USD from Fred | Loan Amount | `25,000 USD` |
