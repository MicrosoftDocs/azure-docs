---
author: JanSchietse
ms.author: janschietse
ms.date: 03/17/2025
ms.topic: include
ms.service: azure-health-insights
---


```json
{
  "jobData" : {
    "configuration" : {
      "inferenceOptions" : {
        "followupRecommendationOptions" : {
          "includeRecommendationsWithNoSpecifiedModality" : false,
          "includeRecommendationsInReferences" : false,
          "provideFocusedSentenceEvidence" : true
        },
        "findingOptions" : {
          "provideFocusedSentenceEvidence" : true
        },
        "GuidanceOptions" : {
          "showGuidanceInHistory" : true
        }
      },
      "inferenceTypes" : ["guidance" ],
      "locale" : "en-US",
      "verbose" : false,
      "includeEvidence" : false
    },
    "patients" : [ {
      "id" : "11111",
      "details" : {
        "sex" : "female",
        "birthDate" : "1939-05-25",
        "clinicalInfo" : [ {
          "resourceType" : "Observation",
          "status" : "unknown",
          "code" : {
            "coding" : [ {
              "system" : "http://www.nlm.nih.gov/research/umls",
              "code" : "C0018802",
              "display" : "MalignantNeoplasms"
            } ]
          },
          "valueBoolean" : "true"
        } ]
      },
      "encounters" : [ {
        "id" : "encounterid1",
        "period" : {
          "start" : "2014-2-20T00:00:00",
          "end" : "2014-2-20T00:00:00"
        },
        "class" : "inpatient"
      } ],
      "patientDocuments" : [ {
        "type" : "note",
        "clinicalType" : "radiologyReport",
        "id" : "docid1",
        "language" : "en",
        "authors" : [ {
          "id" : "authorid1",
          "name" : "authorname1"
        } ],
        "specialtyType" : "radiology",
        "createdAt" : "2014-2-20T00:00:00",
        "administrativeMetadata" : {
          "orderedProcedures" : [ {
            "code" : {
              "coding" : [ {
                "system" : "http://loinc.org",
                "code" : "CTCHWO",
                "display" : "CT CHEST WO CONTRAST    "
              } ]
            },
            "description" : "CT CHEST WO CONTRAST    "
          } ],
          "encounterId" : "encounterid1"
        },
        "content" : {
          "sourceType" : "inline",
          "value" : "\n\n\n\r\n\nEXAM: CT CHEST WO CONTRAST\n\nINDICATION: abnormal lung findings. History of emphysema.\n\nTECHNIQUE: Helical CT images through the chest, without contrast. This exam was performed using one or more of the following dose reduction techniques: Automated exposure control, adjustment of the mA and/or kV according to patient size, and/or use of iterative reconstruction technique. \n\nCOMPARISON: Chest CT dated 6/21/2022.\n\nNumber of previous CT examinations or cardiac nuclear medicine (myocardial perfusion) examinations performed in the preceding 12-months: 2\n\nFINDINGS: \n\nHeart size is normal. No pericardial effusion. Thoracic aorta as well as pulmonary arteries are normal in caliber. There are dense coronary artery calcifications. No enlarged axillary, mediastinal, or hilar lymph nodes by CT size criteria. Central airways are widely patent. No bronchial wall thickening. No pneumothorax, pleural effusion or pulmonary edema. The previously identified posterior right upper lobe nodules are no longer seen. However, there are multiple new small pulmonary nodules. An 8 mm nodule in the right upper lobe, image #15 series 4. New posterior right upper lobe nodule measuring 6 mm, image #28 series 4. New 1.2 cm pulmonary nodule, right upper lobe, image #33 series 4. New 4 mm pulmonary nodule left upper lobe, image #22 series 4. New 8 mm pulmonary nodule in the left upper lobe adjacent to the fissure, image #42 series 4. A few new tiny 2 to 3 mm pulmonary nodules are also noted in the left lower lobe. As before there is a background of severe emphysema. No evidence of pneumonia.\n\nLimited evaluation of the upper abdomen shows no concerning abnormality.\n\nReview of bone windows shows no aggressive appearing osseous lesions.\n\n\nIMPRESSION:\n\n1. Previously identified small pulmonary nodules in the right upper lobe have resolved, but there are multiple new small nodules scattered throughout both lungs. Recommend short-term follow-up with noncontrast chest CT in 3 months as per current  Current guidelines (2017 Fleischner Society).\n2. Severe emphysema.\n\nFindings communicated to Dr. Jane Smith.\n\n\r\n"
        }
      } ]
    } ]
  }
}
```