---
title: "Convert Word to Vector: Component reference"
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
# Convert Word to Vector component

This article describes how to use the Convert Word to Vector component in Azure Machine Learning designer to do these tasks:

- Apply various Word2Vec models (Word2Vec, FastText, GloVe pretrained model) on the corpus of text that you specified as input.
- Generate a vocabulary with word embeddings.

This component uses the Gensim library. For more information about Gensim, see its [official website](https://radimrehurek.com/gensim/apiref.html), which includes tutorials and an explanation of algorithms.

### More about converting words to vectors

Converting words to vectors, or word vectorization, is a natural language processing (NLP) process. The process uses language models to map words into vector space. A vector space represents each word by a vector of real numbers. It also allows words with similar meanings have similar representations.

Use word embeddings as initial input for NLP downstream tasks such as text classification and sentiment analysis.

Among various word embedding technologies, in this component, we implemented three widely used methods. Two, Word2Vec and FastText, are online-training models. The other is a pretrained model, glove-wiki-gigaword-100. 

Online-training models are trained on your input data. Pretrained models are trained offline on a larger text corpus (for example, Wikipedia, Google News) that usually contains about 100 billion words. Word embedding then stays constant during word vectorization. Pretrained word models provide benefits such as reduced training time, better word vectors encoded, and improved overall performance.

Here's some information about the methods:

+ Word2Vec is one of the most popular techniques to learn word embeddings by using a shallow neural network. The theory is discussed in this paper, available as a PDF download: [Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/pdf/1301.3781.pdf). The implementation in this component is based on the [Gensim library for Word2Vec](https://radimrehurek.com/gensim/models/word2vec.html).

+ The FastText theory is explained in this paper, available as a PDF download: [Enriching Word Vectors with Subword Information](https://arxiv.org/pdf/1607.04606.pdf). The implementation in this component is based on the [Gensim library for FastText](https://radimrehurek.com/gensim/models/fasttext.html).

+ The GloVe pretrained model is glove-wiki-gigaword-100. It's a collection of pretrained vectors based on a Wikipedia text corpus, which contains 5.6 billion tokens and 400,000 uncased vocabulary words. A PDF download is available: [GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/pubs/glove.pdf).

## How to configure Convert Word to Vector

This component requires a dataset that contains a column of text. Preprocessed text is better.

1. Add the **Convert Word to Vector** component to your pipeline.

2. As input for the component, provide a dataset that contains one or more text columns.

3. For **Target column**, choose only one column that contains text to process.

    Because this component creates a vocabulary from text, the content of columns differs, which leads to different vocabulary contents. That's why the component accepts only one target column.

4. For  **Word2Vec strategy**, choose from **GloVe pretrained English Model**, **Gensim Word2Vec**, and **Gensim FastText**.

5. If **Word2Vec strategy** is **Gensim Word2Vec** or **Gensim FastText**:

    + For **Word2Vec Training Algorithm**, choose from **Skip_gram** and **CBOW**. The difference is introduced in the [original paper (PDF)](https://arxiv.org/pdf/1301.3781.pdf).

        The default method is **Skip_gram**.

    + For **Length of word embedding**, specify the dimensionality of the word vectors. This setting corresponds to the `size` parameter in Gensim.

        The default embedding size is 100.

    + For **Context window size**, specify the maximum distance between the word being predicted and the current word. This setting corresponds to the `window` parameter in Gensim.

        The default window size is 5.

    + For **Number of epochs**, specify the number of epochs (iterations) over the corpus. Corresponds to the `iter` parameter in Gensim.

        The default epoch number is 5.

6. For **Maximum vocabulary size**, specify the maximum number of the words in the generated vocabulary.

    If there are more unique words than the max size, prune the infrequent ones.

    The default vocabulary size is 10,000.

7. For **Minimum word count**, provide a minimum word count. The component will ignore all words that have a frequency lower than this value.

    The default value is 5.

8. Submit the pipeline.

## Examples

The component has one output:

+ **Vocabulary with embeddings**: Contains the generated vocabulary, together with each word's embedding. One dimension occupies one column.

The following example shows how the Convert Word to Vector component works. It uses Convert Word to Vector with default settings to the preprocessed Wikipedia SP 500 Dataset.

### Source dataset

The dataset contains a category column, along with the full text fetched from Wikipedia. The following table shows a few representative examples.

|Text|
|----------|
|nasdaq 100 component s p 500 component foundation founder location city apple campus 1 infinite loop street infinite loop cupertino california cupertino california location country united states...|
|br nasdaq 100 nasdaq 100 component br s p 500 s p 500 component industry computer software foundation br founder charles geschke br john warnock location adobe systems...|
|s p 500 s p 500 component industry automotive industry automotive predecessor general motors corporation 1908 2009 successor...|
|s p 500 s p 500 component industry conglomerate company conglomerate foundation founder location city fairfield connecticut fairfield connecticut location country usa area...|
|br s p 500 s p 500 component foundation 1903 founder william s harley br arthur davidson harley davidson founder arthur davidson br walter davidson br william a davidson location...|

### Output vocabulary with embeddings

The following table contains the output of this component, taking the Wikipedia SP 500 dataset as input. The leftmost column indicates the vocabulary. Its embedding vector is represented by values of remaining columns in the same row.

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

In this example, we used the default **Gensim Word2Vec** for **Word2Vec strategy**, and **Training Algorithm** is **Skip-gram**. **Length of word Embedding** is 100, so we have 100 embedding columns.

## Technical notes

This section contains tips and answers to frequently asked questions.

+ Difference between online-training and pretrained model:

    In this Convert Word to Vector component, we provided three different strategies: two online-training models and one pretrained model. The online-training models use your input dataset as training data, and generate vocabulary and word vectors during training. The pretrained model is already trained by a much larger text corpus, such as Wikipedia or Twitter text. The pretrained model is actually a collection of word/embedding pairs.  

    The GloVe pre-trained model summarizes a vocabulary from the input dataset and generates an embedding vector for each word from the pretrained model. Without online training, the use of a pretrained model can save training time. It has better performance, especially when the input dataset size is relatively small.

+ Embedding size:

    In general, the length of word embedding is set to a few hundred. For example, 100, 200, 300. A small embedding size means a small vector space, which could cause word embedding collisions.  

    The length of word embeddings is fixed for pretrained models. In this example, the embedding size of glove-wiki-gigaword-100 is 100.


## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 

For a list of errors specific to the designer components, see [Machine Learning error codes](designer-error-codes.md).
