# Recommended practices for Custom entity extraction

## Development life cycle

Follow the recommended development life cycle for best results:

* **Define schema**: Know your data and identify the entities you want extracted, avoid ambiguity.

* **Tag data**: Tagging data is a key factor in determining model performance. Tag precisely, consistently and completely.
  * **Tag precisely**: Tag each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your tag.
  * **Tag consistently**:  The same entity should have the same tag across all the files.
  * **Tag completely**: Tag all the instances of the entity in all your files.

* **Train model**: This is where the magic happens, your model starts learning from your tagged data.

* **View model evaluation details**: In this step you view the evaluation details for your model to determine how well it performs when introduced to new data.

* **Improve model**: In this step you can work on improving your model performance by examining the incorrect model predictions and examining data distribution.

* **Deploy model**: Deploying a model is to make it available for use via the [Analyze API](../../extras/Microsoft.CustomText.Runtime.v3.1-preview.1.json).

* **Extract entities**: Use your custom models for entity extraction tasks.

![dev-lifecycle](../../media/extraction/ct-dev-lifecycle.png)

## Recommendations

### Schema design

The schema defines the entity types/categories that you need your model to extract from the text at runtime.

* Review files in your dataset to be familiar with their format and structure.

* Identify the [entities](ct-concept-definitions.md#entity) you want to extract from the data. <br> 
For example, if you are extracting entities from support emails, you might need to extract `Customer name`, `Product name`, `Customer's problem`, `Request date`, and `Contact information`.

* Avoid entity types ambiguity.
**Ambiguity** happens when the types you select are similar to each other.
The more ambiguous your schema the more tagged data you will to train your model.<br> 
For example, if you are extracting data from a legal contract, to extract `Name of first party` and `Name of second party` you will need to add more examples to overcome ambiguity since the names of both parties look similar. Avoiding ambiguity saves time, effort and yields better results.

* Avoid complex entities.
Complex entities can be very difficult to pick out precisely from text, consider breaking it down into multiple entities.<br>
For example, the model would have a hard time extracting `Address` if it was not broken down into down into smaller entities. There are so many variations of how addresses appear, it would take significantly large number of tagged entities to teach the model to extract an address, as a whole, without breaking it down. However, if you replace `Address` with `Street Name`, `PO Box`, `City`, `State` and `Zip`, the model  will require fewer tags per entity.

### Data selection

The quality of data you train your model with affects model performance greatly.

* Use real life data that reflects your domain problem space to effectively train your model.
What about synthetic data? Whenever possible, use **real data** to train your model. Synthetic data will never have the variation found in real life data created by humans.
If you need to start your model with synthetic data, you can do that - but note that you’ll need to add real data later to improve model performance.

* Use diverse data as much as you can to avoid overfitting your model.
**Overfitting** happens when you train your model with similar data so that it is unable to predict anything outside what it was trained on. This makes the model useful only to the initial dataset, and not to any other datasets.

* Balance data distribution to represent expected data at runtime.
Make sure that all the scenarios/entities are adequately represented in your dataset.
Include less frequent cases in your data, if the model was not exposed a certain scenario/entity in training it wont be able to recognize it in runtime. <br>
For example, if you are training your model to extract entities from legal documents, which come in many different formats and use different language, you should provide examples that span this diversity as you would expect to see in real life.

> [!NOTE]
> If your files are in multiple languages you need to enable this option when [**creating your project**](ct-how-to-create-project.md).

* Avoid duplicate files in your data. Duplicate data has a negative impact on training process, model metrics, and model performance.

* Consider where your data comes from. If you are collecting data from one person or department, you are likely missing diversity that will be important for your model to learn about all usage scenarios.

### Data Tagging

* **Tag precisely**: Tag each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your tag. Imprecise tags can lead to poor results.

* **Tag consistently**: The same entity should have the same tag across all the files.

* **Tag completely**: Tag data in all the files of your project, in case you have untagged files make sure that this is due to the absence of entities in them. Make sure to tag  all available instances of all entities in each file.

* As a general rule, more tagged data lead to better results given tagging is done precisely, consistently and completely.

* There is no magical number to how many tags are needed, you can start with 20 tags per entity. This is highly dependent on your schema and entities ambiguity, with ambiguous entity types you need more tags. This also depends on the quality of tagging.

> [!NOTE]
> The precision, consistency and completeness of your tagged data are key factors to determining model performance.

* [View model evaluation details](ct-how-to-view-model-evaluation.md) after training is completed. Model evaluation is against the [test set](ct-concept-training.md#test-set), this is a blind set which was not introduced to the model during training. By doing this you get sense of who the model performs in real life scenarios.

* [Improve your model](ct-how-to-improve-model.md). By doing this you can view the incorrect predictions your model made against the [validation set](ct-concept-training.md#validation-set) so this is a chance to tag your data better. Examine data distribution to make sure that each entity is well represented in your dataset.

## Next Steps

* [Create a project](ct-how-to-create-project.md)
* [Tag data](ct-how-to-tag-data.md)
