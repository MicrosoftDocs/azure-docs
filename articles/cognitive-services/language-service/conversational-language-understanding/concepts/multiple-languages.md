# Multilingual conversation projects

## Multilingual intent and learned entity components

When you enable multiple languages in a project, you can train the project primarily in one language and immediately get predictions in others. 

For example, you can train your project entirely with English utterances, and query it in French, German, Mandarin, Japanese, Korean and others! Conversational language understanding makes it easy for you to scale out your projects to multiple languages by using multilingual technology to train your models. You should expect to get relatively accurate results for various languages in both intents and learned entity components, as those are both machine-learned and make use of advanced multilingual technology. 

Whenever you identify that a particular language is not performing as well as other languages, you simply need to add utterances for that language in your project. Go to the [tag utterances](../how-to/tag-utterances.md) page and select the language of the utterance you're adding. When you introduce some examples for that language to the model, it is introduced to the syntax of that language more and learns to predict it better.

You aren't expected to add the same amount of utterances for every language. You should build the majority of your project in one language, and only add a few utterances in languages you obeserve aren't performing well. If you create a project that is primarily in English, and start testing it in French, German, and Spanish, you might observe that German doesn't perform as well as the other two languages. In that case, add 5% of your original English examples in German, train a new model and test German again. You should expect to get better results for German queries. The more utterances you add, the more likely the results are going to get better. 

When you add data in another language, you shouldn't expect it to negatively affect other languages. 

## List and prebuilt components in multiple languages

Projects with multiple languages enabled will allow you to specify synonyms **per language** for every list key. Depending on the language you query your project with, you will only get matches of the list component with synonyms of that language. When you query your project, you can specify the language in the request body:

```json
"query": "{query}"
"language": "{language code}"
```

If you do not provide a language, it will fall back to the default language of your project. The different language codes are listed [here](../language-support.md).

Prebuilt components are similar, where you should expect to get predictions for prebuilt components that are available in specific languages. The request's language again determines which components are attempting to be predicted. You can learn more about the language support for each of the prebuilt components [here](../prebuilt-component-reference.md). 

