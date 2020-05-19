---
title: "Convert Word to Vector"
titleSuffix: Azure Machine Learning
description: Learn how to use three provided Word2Vec models to extract a vocabulary and its corresponding word embeddings from a corpus of text.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 05/19/2020
---
# Convert Word to Vector

This article describes how to use the **Convert word to Vector** module in Azure Machine Learning designer (Preview), to apply various different Word2Vec models (Word2Vec, FastText, Glove pre-trained model) on the corpus of text that you specified as input, and generate a vocabulary with words embeddings.

This module uses the Gensim library. For more information about Gensim, see its [official website](https://radimrehurek.com/gensim/apiref.html) that includes tutorials and explanation of algorithms.

### More about Convert Word to Vector

Generally speaking, converting word to vector, or word vectorization, is a natural language processing process, which uses language models or techniques to map words into vector space, that is, to represent each word by a vector of real numbers, and meanwhile, it allows words with similar meanings have similar representations.

Word embeddings can be used as initial input for NLP downstream tasks such as text classification, sentiment analysis etc.

Among various word embedding technologies, in this module, we implemented three widely used methods, including two online-training models, Word2Vec and FastText, and one pre-trained model, glove-wiki-gigaword-100. Online-training models are trained on your input data, while pre-trained models are trained off-line on a larger text corpus, (for example, Wikipedia, Google News) usually contains about 100 billion words, then, word embedding stays constant during word vectorization. Pre-trained word models provide benefits such as reduced training time, better word vectors encoded, and improved overall performance.

+ Word2Vec is one of the most popular techniques to learn word embeddings using shallow neural network, theory is discussed in this paper, available as a PDF download: [Efficient Estimation of Word Representations in Vector Space, Mikolov, Tomas, et al](https://arxiv.org/pdf/1301.3781.pdf). Implementation in this module is based on [gensim library for Word2Vec](https://radimrehurek.com/gensim/models/word2vec.html).

+ FastText theory is explained in this paper, available as a PDF download: [Enriching Word Vectors with Subword Information, Bojanowski, Piotr, et al](https://arxiv.org/pdf/1607.04606.pdf). Implementation in this module is based on [gensim library for FastText](https://radimrehurek.com/gensim/models/fasttext.html).

+ Glove pre-trained model: glove-wiki-gigaword-100, is a collection of pre-trained vectors based on Wikipedia text corpus, which contains 5.6B tokens and 400K uncased vocabulary, pdf is available: [GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/pubs/glove.pdf).

## How to configure Convert Word to Vector

This module requires a dataset that contains a column of text, preprocessed text is better.

1. Add the **Convert Word to Vector** module to your pipeline.

2. As input for the module, provide a dataset containing one or more text columns.

3. For **Target column**, choose only one columns containing text to process.

    In general, because this module creates a vocabulary from text, the content of different columns differs, which leads to different vocabulary contents, therefore, module only accept one target column.

4. For  **Word2Vec strategy**, choose from `GloVe pretrained English Model`, `Gensim Word2Vec`, and `Gensim FastText`.

5. if **Word2Vec strategy** is `Gensim Word2Vec` or `Gensim FastText`:

    + **Word2Vec Training Algorithm**. Choose from `Skip_gram` and `CBOW`. Difference is introduced in the original [paper](https://arxiv.org/pdf/1301.3781.pdf).

        Default method is `Skip_gram`.

    + **Length of word embedding**. Specify the dimensionality of the word vectors. Corresponds to the `size` parameter in gensim.

        Default embedding_size is 100.

    + **Context window size**. Specify the maximum distance between the word being predicted and the current word. Corresponds to the `window` parameter in gensim.

        Default window size is 5.

    + **Number of epochs**. Specify the number of epochs (iterations) over the corpus. Corresponds to the `iter` parameter in gensim.

        Default epochs number is 5.

6. For **Maximum vocabulary size**, Specify the maximum number of the words in generated vocabulary.

    If there are more unique words than this, then prune the infrequent ones.

    Default vocabulary size is 10000.

7. For **Minimum word count**, provide a minimum word count, which makes module ignores all words, which have a frequency lower than this value.

    Default value is 5.

8. Submit the pipeline.

## Examples

The module has one output:

+ **Vocabulary with embeddings**: Contains the generated vocabulary, together with each word's embedding, one dimension occupies one column.

### Result examples

To illustrate how the **Convert Word to Vector** module works, the following example applies this module with the default settings to the preprocessed Wikipedia SP 500 Dataset provided in Azure Machine Learning (preview).

#### Source dataset

The dataset contains a category column, as well as the full text fetched from Wikipedia. This table shows only a few representative examples.

|text|
|----------|
|nasdaq 100 component s p 500 component foundation founder location city apple campus 1 infinite loop street infinite loop cupertino california cupertino california location country united states...|
|br nasdaq 100 nasdaq 100 component br s p 500 s p 500 component industry computer software foundation br founder charles geschke br john warnock location adobe systems...|
|s p 500 s p 500 component industry automotive industry automotive predecessor general motors corporation 1908 2009 successor...|
|s p 500 s p 500 component industry conglomerate company conglomerate foundation founder location city fairfield connecticut fairfield connecticut location country usa area...|
|br s p 500 s p 500 component foundation 1903 founder william s harley br arthur davidson harley davidson founder arthur davidson br walter davidson br william a davidson location...|

#### Output vocabulary with embeddings

The following table contains the output of this module taking Wikipedia SP 500 dataset as input. The leftmost column indicates the vocabulary, its embedding vector is represented by values of remaining columns in the same row.

|Vocabulary|Embedding dim 0|Embedding dim 1|Embedding dim 2|Embedding dim 3|Embedding dim 4|Embedding dim 5|...|Embedding dim 99|
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|nasdaq|-0.375865|0.609234|0.812797|-0.002236|0.319071|-0.591986|...|0.364276
|component|0.081302|0.40001|0.121803|0.108181|0.043651|-0.091452|...|0.636587
|s|-0.34355|-0.037092|-0.012167|0.151542|0.601019|0.084501|...|0.149419
|p|-0.133407|0.073244|0.170396|0.326706|0.213463|-0.700355|...|0.530901
foundation|-0.166819|0.10883|-0.07933|-0.073753|0.262137|0.045725|...|0.27487
founder|-0.297408|0.493067|0.316709|-0.031651|0.455416|-0.284208|...|0.22798
location|-0.375213|0.461229|0.310698|0.213465|0.200092|0.314288|...|0.14228
city|-0.460828|0.505516|-0.074294|-0.00639|0.116545|0.494368|...|-0.2403
apple|0.05779|0.672657|0.597267|-0.898889|0.099901|0.11833|...|0.4636
campus|-0.281835|0.29312|0.106966|-0.031385|0.100777|-0.061452|...|0.05978
infinite|-0.263074|0.245753|0.07058|-0.164666|0.162857|-0.027345|...|-0.0525
loop|-0.391421|0.52366|0.141503|-0.105423|0.084503|-0.018424|...|-0.0521

In this example, we used the default `Gensim Word2Vec` as the **Word2Vec strategy**, **Training Algorithm** is `Skip-gram`, **Length of word Embedding** is 100, therefore, we have 100 embedding columns.

## Technical notes

This section contains tips and answers to frequently asked questions.

+ Difference between online-train and pretrained model

    In this **Convert word to Vector module**, we provided three different strategies, two online-training models, and one pre-trained model. Online-training model uses your input dataset as training data, generates vocabulary and word vectors during training, while pre-trained model is already trained by much larger text corpus such as Wikipedia or Twitter text, thus pre-trained model is actually a collection of (word, embedding) pair.  

    If Glove pre-trained model is chosen as word vectorization strategy, it summarizes a vocabulary from the input dataset and generates embedding vector for each word from the pre-trained model, without online training, the use of pre-trained model could save training time, and has a better performance especially when the input dataset size is relatively small.

+ Embedding size

    In general, the length of word embedding is set to a few hundred (for example, 100, 200, 300) to achieve good performance, because small embedding size means small vector space, which may cause word embedding collisions.  

    For pretrained models, length of word embeddings are fixed, in this implementation, embedding size of glove-wiki-gigaword-100 is 100.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 

For a list of errors specific to the designer(preview) modules, see [Machine Learning Error codes](designer-error-codes.md).
