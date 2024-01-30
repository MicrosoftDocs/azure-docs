---
title: COVID-19 Open Research Dataset
description: Learn how to use the COVID-19 Open Research Dataset dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# COVID-19 Open Research Dataset

Full-text and metadata dataset of COVID-19 and coronavirus-related scholarly articles optimized for machine readability and made available for use by the global research community.

In response to the COVID-19 pandemic, the [Allen Institute for AI](https://allenai.org/) has partnered with leading research groups to prepare and distribute the COVID-19 Open Research Dataset (CORD-19). This dataset is a free resource of over 47,000 scholarly articles, including over 36,000 with full text, about COVID-19 and the coronavirus family of viruses for use by the global research community.

This dataset mobilizes researchers to apply recent advances in natural language processing to generate new insights in support of the fight against this infectious disease.

The corpus may be updated as new research is published in peer-reviewed publications and archival services like [bioRxiv](https://www.biorxiv.org/), [medRxiv](https://www.medrxiv.org/), and others.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## License Terms

This dataset is made available by the Allen Institute of AI and [Semantic Scholar](https://pages.semanticscholar.org/coronavirus-research). By accessing, downloading, or otherwise using any content provided in the CORD-19 Dataset, you agree to the [Dataset License](https://ai2-semanticscholar-cord-19.s3-us-west-2.amazonaws.com/2020-03-13/COVID.DATA.LIC.AGMT.pdf) related to the use this dataset. Specific licensing information for individual articles in the dataset is available in the metadata file. More licensing information is available on the [PMC website](https://www.ncbi.nlm.nih.gov/pmc/tools/openftlist/), [medRxiv website](https://www.medrxiv.org/submit-a-manuscript), and [bioRxiv website](https://www.biorxiv.org/about-biorxiv).

## Volume and retention

This dataset is stored in JSON format and the latest release contains over 36,000 full text articles. Each paper is represented as a single JSON object. [View the schema](https://ai2-semanticscholar-cord-19.s3-us-west-2.amazonaws.com/2020-03-13/json_schema.txt).

## Storage Location
This dataset is stored in the East US Azure region. Locating compute resources in East US is recommended for affinity.

## Citation

When including CORD-19 data in a publication or redistribution, cite the dataset as follows:

In bibliography:

COVID-19 Open Research Dataset (CORD-19). 2020. Version YYYY-MM-DD. Retrieved from [COVID-19 Open Research Dataset (CORD-19)](https://pages.semanticscholar.org/coronavirus-research). Accessed YYYY-MM-DD. doi:10.5281/zenodo.3715505

In text: (CORD-19, 2020)

## Contact

For questions about this dataset, contact partnerships@allenai.org.

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=covid-19-open-research -->


## The CORD-19 Dataset

CORD-19 is a collection of over 50,000 scholarly articles - including over 40,000 with full text - about COVID-19, SARS-CoV-2, and related corona viruses. This dataset has been made freely available with the goal to aid research communities combat the COVID-19 pandemic.

The goal of this notebook is two-fold:

1. Demonstrate how to access the CORD-19 dataset on Azure: We connect to the Azure blob storage account housing the CORD-19 dataset.
2. Walk though the structure of the dataset: Articles in the dataset are stored as json files. We provide examples showing:

  - How to find the articles (navigating the container)
  - How to read the articles (navigating the json schema)

Dependencies: This notebook requires the following libraries:

- Azure storage (for example, `pip install azure-storage`)
- NLTK ([docs](https://www.nltk.org/install.html))
- Pandas (for example, `pip install pandas`)

### Getting the CORD-19 data from Azure

The CORD-19 data has been uploaded as an Azure Open Dataset [here](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/). We create a blob service linked to this CORD-19 open dataset.


```python
from azure.storage.blob import BlockBlobService

# storage account details
azure_storage_account_name = "azureopendatastorage"
azure_storage_sas_token = "sv=2019-02-02&ss=bfqt&srt=sco&sp=rlcup&se=2025-04-14T00:21:16Z&st=2020-04-13T16:21:16Z&spr=https&sig=JgwLYbdGruHxRYTpr5dxfJqobKbhGap8WUtKFadcivQ%3D"

# create a blob service
blob_service = BlockBlobService(
    account_name=azure_storage_account_name,
    sas_token=azure_storage_sas_token,
)
```

We can use this blob service as a handle on the data. We can navigate the dataset making use of the `BlockBlobService` APIs. See here for more details:

* [Blob service concepts](/rest/api/storageservices/blob-service-concepts)
* [Operations on containers](/rest/api/storageservices/operations-on-containers)

The CORD-19 data is stored in the `covid19temp` container. This is the file structure within the container together with an example file.

```
metadata.csv
custom_license/
    pdf_json/
        0001418189999fea7f7cbe3e82703d71c85a6fe5.json        # filename is sha-hash
        ...
    pmc_json/
        PMC1065028.xml.json                                  # filename is the PMC ID
        ...
noncomm_use_subset/
    pdf_json/
        0036b28fddf7e93da0970303672934ea2f9944e7.json
        ...
    pmc_json/
        PMC1616946.xml.json
        ...
comm_use_subset/
    pdf_json/
        000b7d1517ceebb34e1e3e817695b6de03e2fa78.json
        ...
    pmc_json/
        PMC1054884.xml.json
        ...
biorxiv_medrxiv/                                             # note: there is no pmc_json subdir
    pdf_json/
        0015023cc06b5362d332b3baf348d11567ca2fbb.json
        ...
```

Each .json file corresponds to an individual article in the dataset. This is where the title, authors, abstract and (where available) the full text data is stored.

### Using metadata.csv
The CORD-19 dataset comes with `metadata.csv` - a single file that records basic information on all the papers available in the CORD-19 dataset. This is a good place to start exploring!


```python
# container housing CORD-19 data
container_name = "covid19temp"

# download metadata.csv
metadata_filename = 'metadata.csv'
blob_service.get_blob_to_path(
    container_name=container_name,
    blob_name=metadata_filename,
    file_path=metadata_filename
)
```

```python
import pandas as pd

# read metadata.csv into a dataframe
metadata_filename = 'metadata.csv'
metadata = pd.read_csv(metadata_filename)
```

```python
metadata.head(3)
```

That's a lot to take in at first glance, so let's apply a little polish.

```python
simple_schema = ['cord_uid', 'source_x', 'title', 'abstract', 'authors', 'full_text_file', 'url']

def make_clickable(address):
    '''Make the url clickable'''
    return '<a href="{0}">{0}</a>'.format(address)

def preview(text):
    '''Show only a preview of the text data.'''
    return text[:30] + '...'

format_ = {'title': preview, 'abstract': preview, 'authors': preview, 'url': make_clickable}

metadata[simple_schema].head().style.format(format_)
```

```python
# let's take a quick look around
num_entries = len(metadata)
print("There are {} many entries in this dataset:".format(num_entries))

metadata_with_text = metadata[metadata['full_text_file'].isna() == False]
with_full_text = len(metadata_with_text)
print("-- {} have full text entries".format(with_full_text))

with_doi = metadata['doi'].count()
print("-- {} have DOIs".format(with_doi))

with_pmcid = metadata['pmcid'].count()
print("-- {} have PubMed Central (PMC) ids".format(with_pmcid))

with_microsoft_id = metadata['Microsoft Academic Paper ID'].count()
print("-- {} have Microsoft Academic paper ids".format(with_microsoft_id))
```

```
There are 51078 many entries in this dataset:
-- 42511 have full text entries
-- 47741 have DOIs
-- 41082 have PubMed Central (PMC) ids
-- 964 have Microsoft Academic paper ids
```

## Example: Read full text

`metadata.csv` doesn't contain the full-text itself. Let's see an example of how to read that. Locate and unpack the full text json and convert it to a list of sentences.

```python
# choose a random example with pdf parse available
metadata_with_pdf_parse = metadata[metadata['has_pdf_parse']]
example_entry = metadata_with_pdf_parse.iloc[42]

# construct path to blob containing full text
blob_name = '{0}/pdf_json/{1}.json'.format(example_entry['full_text_file'], example_entry['sha'])  # note the repetition in the path
print("Full text blob for this entry:")
print(blob_name)
```

We can now read the json content associated to this blob as follows.

```python
import json
blob_as_json_string = blob_service.get_blob_to_text(container_name=container_name, blob_name=blob_name)
data = json.loads(blob_as_json_string.content)

# in addition to the body text, the metadata is also stored within the individual json files
print("Keys within data:", ', '.join(data.keys()))
```

For the purposes of this example, we are interested in the `body_text`, which stores the text data as follows:

```json
"body_text": [                      # list of paragraphs in full body
    {
        "text": <str>,
        "cite_spans": [             # list of character indices of inline citations
                                    # e.g. citation "[7]" occurs at positions 151-154 in "text"
                                    #      linked to bibliography entry BIBREF3
            {
                "start": 151,
                "end": 154,
                "text": "[7]",
                "ref_id": "BIBREF3"
            },
            ...
        ],
        "ref_spans": <list of dicts similar to cite_spans>,     # e.g. inline reference to "Table 1"
        "section": "Abstract"
    },
    ...
]
```

The full json schema is available [here](https://ai2-semanticscholar-cord-19.s3-us-west-2.amazonaws.com/2020-03-13/json_schema.txt).


```python
from nltk.tokenize import sent_tokenize

# the text itself lives under 'body_text'
text = data['body_text']

# many NLP tasks play nicely with a list of sentences
sentences = []
for paragraph in text:
    sentences.extend(sent_tokenize(paragraph['text']))

print("An example sentence:", sentences[0])
```    

### PDF vs PMC XML Parse

In the above example, we looked at a case with `has_pdf_parse == True`. In that case the blob file path was of the form:

```
'<full_text_file>/pdf_json/<sha>.json'
```

Alternatively, for cases with `has_pmc_xml_parse == True` use the following format:

```
'<full_text_file>/pmc_json/<pmcid>.xml.json'
```

For example:


```python
# choose a random example with pmc parse available
metadata_with_pmc_parse = metadata[metadata['has_pmc_xml_parse']]
example_entry = metadata_with_pmc_parse.iloc[42]

# construct path to blob containing full text
blob_name = '{0}/pmc_json/{1}.xml.json'.format(example_entry['full_text_file'], example_entry['pmcid'])  # note the repetition in the path
print("Full text blob for this entry:")
print(blob_name)

blob_as_json_string = blob_service.get_blob_to_text(container_name=container_name, blob_name=blob_name)
data = json.loads(blob_as_json_string.content)

# the text itself lives under 'body_text'
text = data['body_text']

# many NLP tasks play nicely with a list of sentences
sentences = []
for paragraph in text:
    sentences.extend(sent_tokenize(paragraph['text']))

print("An example sentence:", sentences[0])
```
```
Full text blob for this entry:
custom_license/pmc_json/PMC546170.xml.json
An example sentence: Double-stranded small interfering RNA (siRNA) molecules have drawn much attention since it was unambiguously shown that they mediate potent gene knock-down in a variety of mammalian cells (1).
```    

## Iterate through blobs directly

In the above examples, we used the `metadata.csv` file to navigate the data, construct the blob file path, and read data from the blob. An alternative is the iterate through the blobs themselves.


```python
# get and sort list of available blobs
blobs = blob_service.list_blobs(container_name)
sorted_blobs = sorted(list(blobs), key=lambda e: e.name, reverse=True)
```

Now we can iterate through the blobs directly. For example, let's count the number json files available.


```python
# we can now iterate directly though the blobs
count = 0
for blob in sorted_blobs:
    if blob.name[-5:] == ".json":
        count += 1
print("There are {} many json files".format(count))
```

```
There are 59784 many json files
```  

## Appendix

### Data quality issues

This is a large dataset that, for obvious reasons, was put together rather hastily! Here are some data quality issues we've observed.

#### Multiple shas

We observe that in some cases there are multiple shas for a given entry.

```python
metadata_multiple_shas = metadata[metadata['sha'].str.len() > 40]

print("There are {} many entries with multiple shas".format(len(metadata_multiple_shas)))

metadata_multiple_shas.head(3)
```
```
There are 1999 many entries with multiple shas
```

## Layout of the container

Here we use a simple regex to explore the file structure of the container in case this is updated in the future.

```python
container_name = "covid19temp"
blobs = blob_service.list_blobs(container_name)
sorted_blobs = sorted(list(blobs), key=lambda e: e.name, reverse=True)
```

```python
import re
dirs = {}

pattern = '([\w]+)\/([\w]+)\/([\w.]+).json'
for blob in sorted_blobs:
    
    m = re.match(pattern, blob.name)
    
    if m:
        dir_ = m[1] + '/' + m[2]
        
        if dir_ in dirs:
            dirs[dir_] += 1
        else:
            dirs[dir_] = 1
        
dirs
```

<!-- nbend -->

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=covid-19-open-research -->


## The CORD-19 Dataset

CORD-19 is a collection of over 50,000 scholarly articles - including over 40,000 with full text - about COVID-19, SARS-CoV-2, and related corona viruses. This dataset has been made freely available with the goal to aid research communities combat the COVID-19 pandemic.

The goal of this notebook is two-fold:

1. Demonstrate how to access the CORD-19 dataset on Azure: We use AzureML Dataset to provide a context for the CORD-19 data.
2. Walk though the structure of the dataset: Articles in the dataset are stored as json files. We provide examples showing:

  - How to find the articles (navigating the directory structure)
  - How to read the articles (navigating the json schema)

Dependencies: This notebook requires the following libraries:

- AzureML Python SDK (for example, `pip install --upgrade azureml-sdk`)
- Pandas (for example, `pip install pandas`)
- NLTK ([docs](https://www.nltk.org/install.html)) (for example, `pip install nltk`)

If your NLTK does not have `punkt` package you will need to run:

```
import nltk
nltk.download('punkt')
```

### Getting the CORD-19 data from Azure

The CORD-19 data has been uploaded as an Azure Open Dataset [here](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/). In this notebook, we use AzureML [Dataset](/python/api/azureml-core/azureml.core.dataset.dataset) to reference the CORD-19 open dataset.

```python
import azureml.core
print("Azure ML SDK Version: ", azureml.core.VERSION)
```

```python
from azureml.core import  Dataset
cord19_dataset = Dataset.File.from_files('https://azureopendatastorage.blob.core.windows.net/covid19temp')
mount = cord19_dataset.mount()
```

The `mount()` method creates a context manager for mounting file system streams defined by the dataset as local files.

Use `mount.start()` and `mount.stop()` or alternatively use `with mount():` to manage context.

Mount is only supported on Unix or Unix-like operating systems and libfuse must be present. If you are running inside a docker container, the docker container must be started with the `--privileged` flag or started with `--cap-add SYS_ADMIN --device /dev/fuse`. For more information, see the [docs](/python/api/azureml-core/azureml.data.file_dataset.filedataset?view=azure-ml-py#mount-mount-point-none----kwargs-&preserve-view=true)


```python
import os

COVID_DIR = '/covid19temp'
path = mount.mount_point + COVID_DIR

with mount:
    print(os.listdir(path))
```
```
['antiviral_with_properties_compressed.sdf', 'biorxiv_medrxiv', 'biorxiv_medrxiv_compressed.tar.gz', 'comm_use_subset', 'comm_use_subset_compressed.tar.gz', 'custom_license', 'custom_license_compressed.tar.gz', 'metadata.csv', 'noncomm_use_subset', 'noncomm_use_subset_compressed.tar.gz']
```

This is the file structure within the CORD-19 dataset together with an example file.

```
metadata.csv
custom_license/
    pdf_json/
        0001418189999fea7f7cbe3e82703d71c85a6fe5.json        # filename is sha-hash
        ...
    pmc_json/
        PMC1065028.xml.json                                  # filename is the PMC ID
        ...
noncomm_use_subset/
    pdf_json/
        0036b28fddf7e93da0970303672934ea2f9944e7.json
        ...
    pmc_json/
        PMC1616946.xml.json
        ...
comm_use_subset/
    pdf_json/
        000b7d1517ceebb34e1e3e817695b6de03e2fa78.json
        ...
    pmc_json/
        PMC1054884.xml.json
        ...
biorxiv_medrxiv/                                             # note: there is no pmc_json subdir
    pdf_json/
        0015023cc06b5362d332b3baf348d11567ca2fbb.json
        ...
```

Each .json file corresponds to an individual article in the dataset. This is where the title, authors, abstract and (where available) the full text data is stored.

## Using metadata.csv

The CORD-19 dataset comes with `metadata.csv` - a single file that records basic information on all the papers available in the CORD-19 dataset. This is a good place to start exploring!


```python
import pandas as pd

# create mount context
mount.start()

# specify path to metadata.csv
COVID_DIR = 'covid19temp'
metadata_filename = '{}/{}/{}'.format(mount.mount_point, COVID_DIR, 'metadata.csv')

# read metadata
metadata = pd.read_csv(metadata_filename)
metadata.head(3)
```

```python
simple_schema = ['cord_uid', 'source_x', 'title', 'abstract', 'authors', 'full_text_file', 'url']

def make_clickable(address):
    '''Make the url clickable'''
    return '<a href="{0}">{0}</a>'.format(address)

def preview(text):
    '''Show only a preview of the text data.'''
    return text[:30] + '...'

format_ = {'title': preview, 'abstract': preview, 'authors': preview, 'url': make_clickable}

metadata[simple_schema].head().style.format(format_)
```

```python
# let's take a quick look around
num_entries = len(metadata)
print("There are {} many entries in this dataset:".format(num_entries))

metadata_with_text = metadata[metadata['full_text_file'].isna() == False]
with_full_text = len(metadata_with_text)
print("-- {} have full text entries".format(with_full_text))

with_doi = metadata['doi'].count()
print("-- {} have DOIs".format(with_doi))

with_pmcid = metadata['pmcid'].count()
print("-- {} have PubMed Central (PMC) ids".format(with_pmcid))

with_microsoft_id = metadata['Microsoft Academic Paper ID'].count()
print("-- {} have Microsoft Academic paper ids".format(with_microsoft_id))
```    

### Example: Read full text

`metadata.csv` doesn't contain the full-text itself. Let's see an example of how to read that. Locate and unpack the full text json and convert it to a list of sentences.


```python
# choose a random example with pdf parse available
metadata_with_pdf_parse = metadata[metadata['has_pdf_parse']]
example_entry = metadata_with_pdf_parse.iloc[42]

# construct path to blob containing full text
filepath = '{0}/{1}/pdf_json/{2}.json'.format(path, example_entry['full_text_file'], example_entry['sha'])
print("Full text filepath:")
print(filepath)
```    

We can now read the json content associated to this file as follows.

```python
import json

try:
    with open(filepath, 'r') as f:
        data = json.load(f)
except FileNotFoundError as e:
    # in case the mount context has been closed
    mount.start()
    with open(filepath, 'r') as f:
        data = json.load(f)
        
# in addition to the body text, the metadata is also stored within the individual json files
print("Keys within data:", ', '.join(data.keys()))
```

```
Keys within data: paper_id, metadata, abstract, body_text, bib_entries, ref_entries, back_matter
```

For the purposes of this example, we are interested in the `body_text`, which stores the text data as follows:

```json
"body_text": [                      # list of paragraphs in full body
    {
        "text": <str>,
        "cite_spans": [             # list of character indices of inline citations
                                    # e.g. citation "[7]" occurs at positions 151-154 in "text"
                                    #      linked to bibliography entry BIBREF3
            {
                "start": 151,
                "end": 154,
                "text": "[7]",
                "ref_id": "BIBREF3"
            },
            ...
        ],
        "ref_spans": <list of dicts similar to cite_spans>,     # e.g. inline reference to "Table 1"
        "section": "Abstract"
    },
    ...
]
```

View the [full JSON schema](https://ai2-semanticscholar-cord-19.s3-us-west-2.amazonaws.com/2020-03-13/json_schema.txt).


```python
from nltk.tokenize import sent_tokenize
# the text itself lives under 'body_text'
text = data['body_text']

# many NLP tasks play nicely with a list of sentences
sentences = []
for paragraph in text:
    sentences.extend(sent_tokenize(paragraph['text']))

print("An example sentence:", sentences[0])
```
    

#### PDF vs PMC XML Parse

In the above example, we looked at a case with `has_pdf_parse == True`. In that case the file path was of the form:

```
'<full_text_file>/pdf_json/<sha>.json'
```

Alternatively, for cases with `has_pmc_xml_parse == True` use the following format:

```
'<full_text_file>/pmc_json/<pmcid>.xml.json'
```

For example:


```python
# choose a random example with pmc parse available
metadata_with_pmc_parse = metadata[metadata['has_pmc_xml_parse']]
example_entry = metadata_with_pmc_parse.iloc[42]

# construct path to blob containing full text
filename = '{0}/pmc_json/{1}.xml.json'.format(example_entry['full_text_file'], example_entry['pmcid'])  # note the repetition in the path
print("Path to file: {}\n".format(filename))

with open(mount.mount_point + '/' + COVID_DIR + '/' + filename, 'r') as f:
    data = json.load(f)

# the text itself lives under 'body_text'
text = data['body_text']

# many NLP tasks play nicely with a list of sentences
sentences = []
for paragraph in text:
    sentences.extend(sent_tokenize(paragraph['text']))

print("An example sentence:", sentences[0])
```

## Appendix

### Data quality issues

This is a large dataset that, for obvious reasons, was put together rather hastily! Here are some data quality issues we've observed.


```python
metadata_multiple_shas = metadata[metadata['sha'].str.len() > 40]

print("There are {} many entries with multiple shas".format(len(metadata_multiple_shas)))

metadata_multiple_shas.head(3)
```

<!-- nbend -->

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).