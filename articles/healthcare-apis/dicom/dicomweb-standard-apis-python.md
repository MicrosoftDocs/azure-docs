---
title:  Using DICOMweb&trade;Standard APIs with Python - Azure Healthcare APIs 
description: In this tutorial, you'll learn how to use DICOMweb&trade;Standard APIs with cURL. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.date: 06/21/2021
ms.author: aersoy
---

# Using DICOMWeb&trade; Standard APIs with Python

This tutorial uses Python to demonstrate working with the DICOM Service.

In the tutorial, we'll use these [sample DICOM files](../dcms). The file name, studyUID, seriesUID, and instanceUID of the sample DICOM files is as follows:

| File | StudyUID | SeriesUID | InstanceUID |
| --- | --- | --- | ---|
|green-square.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652|1.2.826.0.1.3680043.8.498.12714725698140337137334606354172323212|
|red-triangle.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652|1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395|
|blue-circle.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207|1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114|

> [!NOTE]
> Each of these files represent a single instance and are part of the same study. Also green-square and red-triangle are part of the same series, while blue-circle is in a separate series.


## Prerequisites

To use the DICOMWeb&trade; Standard APIs, you must have an instance of the DICOM Service deployed. If you haven't already deployed the DICOM Service, see [Deploy DICOM Services using the Azure portal](deploy-dicom-services-in-azure.md).

Once you've deployed an instance of the DICOM Service, retrieve the URL for your App Service:

1. Sign into the [Azure portal](https://ms.portal.azure.com/).
1. Search **Recent resources** and select your DICOM Service instance.
1. Copy the **Service URL** of your DICOM Service.

For this code, we'll be accessing an unsecured dev/test service. Please don't upload any private health information (PHI).


## Working with the DICOM Service

The DICOMweb&trade; Standard makes heavy use of `multipart/related` HTTP requests combined with DICOM specific accept headers. Developers familiar with other REST-based APIs often find working with the DICOMweb&trade; standard awkward. However, once you have it up and running, it's easy to use. It just takes a little familiarity to get started.

### Import the appropriate Python libraries

First, import the necessary Python libraries. 

We've chosen to implement this example using the synchronous `requests` library. For asynchronous support, consider using `httpx` or another async library. Additionally, we're importing two supporting functions from `urllib3` to support working with `multipart/related` requests.


```python
import requests
import pydicom
from pathlib import Path
from urllib3.filepost import encode_multipart_formdata, choose_boundary
```

### Configure user-defined variables to be used throughout

Replace all variable values wrapped in { } with your own values. Additionally, validate that any constructed variables are correct.  For instance, `base_url` is constructed using the default URL for Azure App Service. If you're using a custom URL, you'll need to override that value with your own.


```python
dicom_server_name = "{server-name}"
path_to_dicoms_dir = "{path to the folder that includes green-square.dcm and other dcm files}"

base_url = f"https://{dicom_server_name}.azurewebsites.net"

study_uid = "1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420"; #StudyInstanceUID for all 3 examples
series_uid = "1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652"; #SeriesInstanceUID for green-square and red-triangle
instance_uid = "1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"; #SOPInstanceUID for red-triangle
```

### Create supporting methods to support `multipart\related`

The `Requests` libraries (and most Python libraries) do not work with `multipart\related` in a way that supports DICOMweb&trade;. Because of these libraries, we must add a few methods to support working with DICOM files.

`encode_multipart_related` takes a set of fields (in the DICOM case, these libraries are generally Part 10 dam files) and an optional user-defined boundary. It returns both the full body, along with the content_type, which it can be used.


```python
def encode_multipart_related(fields, boundary=None):
    if boundary is None:
        boundary = choose_boundary()

    body, _ = encode_multipart_formdata(fields, boundary)
    content_type = str('multipart/related; boundary=%s' % boundary)

    return body, content_type
```

### Create a `requests` session

Create a `requests` session, called `client`, that will be used to communicate with the Medical Imaging Server for DICOM.


```python
client = requests.session()
```

--------------------
## Uploading DICOM Instances (STOW)

The following examples highlight persisting DICOM files.

### Store-instances-using-multipart/related

This example demonstrates how to upload a single DICOM file, and it uses a bit of a Python to pre-load the DICOM file (as bytes) into memory.  By passing an array of files to the fields parameter of encode_multipart_related, multiple files can be uploaded in a single POST. It is sometimes used to upload a complete series or study.

_Details:_

* Path: ../studies
* Method: POST
* Headers:
    * `Accept: application/dicom+json`
    * `Content-Type: multipart/related; type="application/dicom"`
* Body:
    * `Content-Type: application/dicom` for each file uploaded, separated by a boundary value

> Some programming languages and tools behave differently. For instance, some require you to define your own boundary. For those, you may need to use a slightly modified Content-Type header. The following have been used successfully.
 > * `Content-Type: multipart/related; type="application/dicom"; boundary=ABCD1234`
 > * `Content-Type: multipart/related; boundary=ABCD1234`
 > * `Content-Type: multipart/related`


```python
#upload blue-circle.dcm
filepath = Path(path_to_dicoms_dir).joinpath('blue-circle.dcm')

# Hack. Need to open up and read through file and load bytes into memory 
with open(filepath,'rb') as reader:
    rawfile = reader.read()
files = {'file': ('dicomfile', rawfile, 'application/dicom')}

#encode as multipart_related
body, content_type = encode_multipart_related(fields = files)

headers = {'Accept':'application/dicom+json', "Content-Type":content_type}

url = f'{base_url}/studies'
response = client.post(url, body, headers=headers, verify=False)
```

### Store-instances-for-a-specific-study

This example demonstrates how to upload multiple DICOM files into the specified study. It uses a bit of a Python to pre-load the DICOM file (as bytes) into memory.  

By passing an array of files to the fields parameter of `encode_multipart_related`, multiple files can be uploaded in a single POST. It is sometimes used to upload a complete series or study. 

_Details:_
* Path: ../studies/{study}
* Method: POST
* Headers:
    * `Accept: application/dicom+json`
    * `Content-Type: multipart/related; type="application/dicom"`
* Body:
    * `Content-Type: application/dicom` for each file uploaded, separated by a boundary value


```python

filepath_red = Path(path_to_dicoms_dir).joinpath('red-triangle.dcm')
filepath_green = Path(path_to_dicoms_dir).joinpath('green-square.dcm')

# Hack. Need to open up and read through file and load bytes into memory 
with open(filepath_red,'rb') as reader:
    rawfile_red = reader.read()
with open(filepath_green,'rb') as reader:
    rawfile_green = reader.read()  
       
files = {'file_red': ('dicomfile', rawfile_red, 'application/dicom'),
         'file_green': ('dicomfile', rawfile_green, 'application/dicom')}

#encode as multipart_related
body, content_type = encode_multipart_related(fields = files)

headers = {'Accept':'application/dicom+json', "Content-Type":content_type}

url = f'{base_url}/studies'
response = client.post(url, body, headers=headers, verify=False)
```

### Store single instance (non-standard)

The following code example demonstrates how to upload a single DICOM file. It is a non-standard API endpoint simplifies uploading a single file as binary bytes sent in the body of a request

_Details:_
* Path: ../studies
* Method: POST
* Headers:
   *  `Accept: application/dicom+json`
   *  `Content-Type: application/dicom`
* Body:
    * Contains a single DICOM file as binary bytes.

```python
#upload blue-circle.dcm
filepath = Path(path_to_dicoms_dir).joinpath('blue-circle.dcm')

# Hack. Need to open up and read through file and load bytes into memory 
with open(filepath,'rb') as reader:
    body = reader.read()

headers = {'Accept':'application/dicom+json', 'Content-Type':'application/dicom'}

url = f'{base_url}/studies'
response = client.post(url, body, headers=headers, verify=False)
response  # response should be a 409 Conflict if the file was already uploaded in the above request
```

## Retrieve DICOM Instances (WADO)

The following examples highlight retrieving DICOM instances.

### Retrieve all instances within a study

This example retrieves all instances within a single study.

_Details:_
* Path: ../studies/{study}
* Method: GET
* Headers:
   * `Accept: multipart/related; type="application/dicom"; transfer-syntax=*`

All three of the `.dcm` files that we uploaded previously are part of the same study so the response should return all three instances. Validate that the response has a status code of OK and that all three instances are returned.

```python
url = f'{base_url}/studies/{study_uid}'
headers = {'Accept':'multipart/related; type="application/dicom"; transfer-syntax=*'}

response = client.get(url, headers=headers) #, verify=False)
```

### Use the retrieved instances

The instances are retrieved as binary bytes. You can loop through the returned items and convert the bytes into a file-like that can be read by `pydicom`.


```python
import requests_toolbelt as tb
from io import BytesIO

mpd = tb.MultipartDecoder.from_response(response)
for part in mpd.parts:
    # Note that the headers are returned as binary!
    print(part.headers[b'content-type'])
    
    # You can convert the binary body (of each part) into a pydicom DataSet
    #   And get direct access to the various underlying fields
    dcm = pydicom.dcmread(BytesIO(part.content))
    print(dcm.PatientName)
    print(dcm.SOPInstanceUID)
```


### Retrieve metadata of all instances in study

This request retrieves the metadata for all instances within a single study.

_Details:_
* Path: ../studies/{study}/metadata
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

All three of the `.dcm` files that we uploaded previously are part of the same study so the response should return the metadata for all three instances. Validate that the response has a status code of OK and that all the metadata is returned.

```python
url = f'{base_url}/studies/{study_uid}/metadata'
headers = {'Accept':'application/dicom+json'}

response = client.get(url, headers=headers) #, verify=False)
```

### Retrieve all instances within a series

This request retrieves all instances within a single series.

_Details:_
* Path: ../studies/{study}/series/{series}
* Method: GET
* Headers:
   * `Accept: multipart/related; type="application/dicom"; transfer-syntax=*`

This series has two instances (green-square and red-triangle), so the response should return both instances. Validate that the response has a status code of OK and that both instances are returned.

```python
url = f'{base_url}/studies/{study_uid}/series/{series_uid}'
headers = {'Accept':'multipart/related; type="application/dicom"; transfer-syntax=*'}

response = client.get(url, headers=headers) #, verify=False)
```


### Retrieve metadata of all instances in series

This request retrieves the metadata for all instances within a single series.

_Details:_
* Path: ../studies/{study}/series/{series}/metadata
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

This series has two instances (green-square and red-triangle), so the response should return metatdata for both instances. Validate that the response has a status code of OK and that both instances metadata are returned.

```python
url = f'{base_url}/studies/{study_uid}/series/{series_uid}/metadata'
headers = {'Accept':'application/dicom+json'}

response = client.get(url, headers=headers) #, verify=False)
```

### Retrieve a single instance within a series of a study

This request retrieves a single instance.

_Details:_
* Path: ../studies/{study}/series{series}/instances/{instance}
* Method: GET
* Headers:
   * `Accept: application/dicom; transfer-syntax=*`

This code example should only return the instance red-triangle. Validate that the response has a status code of OK and that the instance is returned.


```python
url = f'{base_url}/studies/{study_uid}/series/{series_uid}/instances/{instance_uid}'
headers = {'Accept':'application/dicom; transfer-syntax=*'}

response = client.get(url, headers=headers) #, verify=False)
```


### Retrieve metadata of a single instance within a series of a study

This request retrieves the metadata for a single instance within a single study and series.

_Details:_
* Path: ../studies/{study}/series/{series}/instances/{instance}/metadata
* Method: GET
* Headers:
  * `Accept: application/dicom+json`

This code example should only return the metatdata for the instance red-triangle. Validate that the response has a status code of OK and that the metadata is returned.

```python
url = f'{base_url}/studies/{study_uid}/series/{series_uid}/instances/{instance_uid}/metadata'
headers = {'Accept':'application/dicom+json'}

response = client.get(url, headers=headers) #, verify=False)
```

### Retrieve one or more frames from a single instance

This request retrieves one or more frames from a single instance.

_Details:_
* Path: ../studies/{study}/series{series}/instances/{instance}/frames/1,2,3
* Method: GET
* Headers:
   * `Accept: multipart/related; type="application/octet-stream"; transfer-syntax=1.2.840.10008.1.2.1` (Default) or
   * `Accept: multipart/related; type="application/octet-stream"; transfer-syntax=*` or
   * `Accept: multipart/related; type="application/octet-stream";`

This code example should return the only frame from the red-triangle. Validate that the response has a status code of OK and that the frame is returned.

```python
url = f'{base_url}/studies/{study_uid}/series/{series_uid}/instances/{instance_uid}/frames/1'
headers = {'Accept':'multipart/related; type="application/octet-stream"; transfer-syntax=*'}

response = client.get(url, headers=headers) #, verify=False)
```

## Query DICOM (QIDO)

In the following examples, we search for items using their unique identifiers. You can also search for other attributes, such as PatientName.

Refer to the [DICOM Conformance Statement](dicom-conformance-statement.md#supported-search-parameters) document for supported DICOM attributes.

---
### Search for studies

This request searches for one or more studies by DICOM attributes.

_Details:_
* Path: ../studies?StudyInstanceUID={study}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

Validate that the response includes one study and that the response code is OK.


```python
url = f'{base_url}/studies'
headers = {'Accept':'application/dicom+json'}
params = {'StudyInstanceUID':study_uid}

response = client.get(url, headers=headers, params=params) #, verify=False)
```

### Search for series

This request searches for one or more series by DICOM attributes.

_Details:_
* Path: ../series?SeriesInstanceUID={series}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

Validate that the response includes one series and that the response code is OK.

```python
url = f'{base_url}/series'
headers = {'Accept':'application/dicom+json'}
params = {'SeriesInstanceUID':series_uid}

response = client.get(url, headers=headers, params=params) #, verify=False)
```

### Search for series within a study

This request searches for one or more series within a single study by DICOM attributes.

_Details:_
* Path: ../studies/{study}/series?SeriesInstanceUID={series}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

Validate that the response includes one series and that the response code is OK.

```python
url = f'{base_url}/studies/{study_uid}/series'
headers = {'Accept':'application/dicom+json'}
params = {'SeriesInstanceUID':series_uid}

response = client.get(url, headers=headers, params=params) #, verify=False)
```


### Search for instances

This request searches for one or more instances by DICOM attributes.

_Details:_
* Path: ../instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

Validate that the response includes one instance and that the response code is OK.

```python
url = f'{base_url}/instances'
headers = {'Accept':'application/dicom+json'}
params = {'SOPInstanceUID':instance_uid}

response = client.get(url, headers=headers, params=params) #, verify=False)
```

### Search for instances within a study

This request searches for one or more instances within a single study by DICOM attributes.

_Details:_
* Path: ../studies/{study}/instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

Validate that the response includes one instance and that the response code is OK.

```python
url = f'{base_url}/studies/{study_uid}/instances'
headers = {'Accept':'application/dicom+json'}
params = {'SOPInstanceUID':instance_uid}

response = client.get(url, headers=headers, params=params) #, verify=False)
```

### Search for instances within a study and series

This request searches for one or more instances within a single study and single series by DICOM attributes.

_Details:_
* Path: ../studies/{study}/series/{series}/instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

Validate that the response includes one instance and that the response code is OK.

```python
url = f'{base_url}/studies/{study_uid}/series/{series_uid}/instances'
headers = {'Accept':'application/dicom+json'}
params = {'SOPInstanceUID':instance_uid}

response = client.get(url, headers=headers, params=params) #, verify=False)
```

-----------------
## Delete DICOM

> [!NOTE]
> Delete is not part of the DICOM standard, but it has been added for convenience.

A 204 response code is returned when the deletion is successful. A 404 response code is returned if the item(s) have never existed or have already been deleted. 

### Delete a specific instance within a study and series

This request deletes a single instance within a single study and single series.

_Details:_
* Path: ../studies/{study}/series/{series}/instances/{instance}
* Method: DELETE
* Headers: No special headers needed

This request deletes the red-triangle instance from the server. If it's successful, the response status code contains no content.

```python
#headers = {'Accept':'anything/at+all'}
url = f'{base_url}/studies/{study_uid}/series/{series_uid}/instances/{instance_uid}'
response = client.delete(url) 
```

### Delete a specific series within a study

This request deletes a single series (and all child instances) within a single study.

_Details:_
* Path: ../studies/{study}/series/{series}
* Method: DELETE
* Headers: No special headers needed

This code example deletes the green-square instance (it's the only element left in the series) from the server. If it's successful, the response status code contains no content.

```python
#headers = {'Accept':'anything/at+all'}
url = f'{base_url}/studies/{study_uid}/series/{series_uid}'
response = client.delete(url) 
```

### Delete a specific study

This request deletes a single study (and all child series and instances).

_Details:_
* Path: ../studies/{study}
* Method: DELETE
* Headers: No special headers needed

```python
#headers = {'Accept':'anything/at+all'}
url = f'{base_url}/studies/{study_uid}'
response = client.delete(url) 
```

### Next Steps

For more information about DICOM Services, see 

>[!div class="nextstepaction"]
>[Overview of DICOM Services](concepts_dicom_overview.md)