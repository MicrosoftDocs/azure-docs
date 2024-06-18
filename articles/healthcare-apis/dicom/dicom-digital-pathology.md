---
title: Digital pathology in the DICOM service in Azure Health Data Services
description: Explore digital pathology with the DICOM service in Azure Health Data Services. Share slide images, train AI models, and store digitized slides securely.
services: healthcare-apis
author: smithasa
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: reference
ms.date: 10/9/2023
ms.author: smithasa
---

# Digital pathology using the DICOM service

Digital imaging in pathology provides a way to share images outside the lab, train AI/ML models, and store digitized microscope slides.

To make these benefits happen, many organizations convert [Whole Slide Imaging (WSI)](https://dicom.nema.org/Dicom/DICOMWSI/) digital slides to DICOM&reg; standard format. After the images are in DICOM format, you can store them in commercially available PACS systems where they can be managed using common radiology tools and processes.

## DICOM service for digital pathology 

The DICOM service supports unique digital pathology requirements like:

- Scale and performance needed to upload pathology DICOM instances that are multiple GBs in size.
- Fast frame access to allow the web viewer to pan and zoom DICOM pathology images smoothly with no lags or blurriness.
- A cost-effective way to store images long-term post diagnosis for archival and research use.

:::image type="content" source="media/dicom-digital-pathology.png" alt-text="Diagram showing whole-slide imaging digitization and cloud storage." lightbox="media/dicom-digital-pathology.png":::

### Digitization

Although the [DICOM standard now supports whole-slide images (WSI)](https://dicom.nema.org/dicom/dicomwsi/), many acquisition scanners don't capture images in the DICOM format. The DICOM service only supports images in the DICOM format, therefore a format conversion is required for WSI in other formats. Several commercial and open-source solutions exist to perform these format conversions.

Here are some samples open source tools to build your own converter:

- [WSIDicomizer](https://github.com/imi-bigpicture/wsidicomizer)

### Storage

Each converted WSI results in a DICOM series with multiple instances. 

#### Batch upload
Considering the bigger size and number of instances that needs to be uploaded, we recommend batch upload of each series or a batch of converted WSIs using [Import](import-files.md).

#### Streaming upload
If you want to upload each file as it gets converted, use the STOW single part request in the example.

[Prerequisites](dicomweb-standard-apis-curl.md#prerequisites)

```cmd
curl -X POST \
    -H "Content-Type: application/dicom" \
    -H "Authorization: Bearer {token}" \
    -H "Accept: application/dicom+json" \
{service-url}/{version}/studies \
    --data-binary {dcmFile}.dcm
```

We tested supporting **tens of GBs upload in few seconds**. 

### Retrieval

Viewers retrieve tiles that are stored as frames in a DICOM instance. Each DICOM instance can contain multiple frames. We recommend using parallel single part GET frame for better performance.

 [Prerequisites](dicomweb-standard-apis-curl.md#prerequisites)

```cmd
curl -X GET \
    -H "Authorization: Bearer {token}" \
    -H "Accept: application/octet-stream; transfer-syntax=*" \
{service-url}/{version}/studies/{studyInstanceUid}/series/{seriesInstanceUid}/instances/{sopInstanceUid}/frames/{frameNumber} \
    --output {fileName}
```

We tested supporting **download of 60Kb tile in around 60-70ms** from client.

### Viewers

We recommend using any WSI Viewer that can be configured with a DICOMWeb service and OIDC Authentication. 

Sample open-source viewer:

- [OHIF Viewer](https://github.com/microsoft/dicom-ohif)
- [Slim](https://github.com/herrmannlab/slim)

Follow the [CORS guidelines](configure-cross-origin-resource-sharing.md) if the Viewer directly interacts with the DICOM service.

## Find an ISV partner

Reach out to dicom-support@microsoft.com if you want to work with our partner ISVs that provide end-to-end solutions and support.

## Next steps

[Deploy the DICOM service in Azure](deploy-dicom-services-in-azure.md)

[Use DICOMweb APIs with the DICOM service](dicomweb-standard-apis-with-dicom-services.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]