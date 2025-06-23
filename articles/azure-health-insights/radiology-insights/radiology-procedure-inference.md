---
title: Radiology Insight inference information (rad procedure)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (rad procedure).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/12/2023
ms.author: JanSchietse
---

# RadiologyProcedureInference

[Back to overview of RI Inferences](inferences.md)


A radiology procedure inference represents an order for a scan, as described in the "orderedProcedures" in the request. There can be several such inferences, because there can be several ordered procedures.

Example:
```json
{
	"kind": "radiologyProcedure",
	"imagingProcedures": [
		{
			"modality": {
				"extension": [],
				"coding": [
					{
						"code": "168537006",
						"system": "http://snomed.info/sct",
						"display": "PLAIN RADIOGRAPHY (PROCEDURE)"
					}
				]
			},
			"anatomy": {
				"extension": [],
				"coding": [
					{
						"code": "56459004",
						"system": "http://snomed.info/sct",
						"display": "FOOT STRUCTURE (BODY STRUCTURE)"
					}
				]
			},
			"laterality": {
				"extension": [],
				"coding": [
					{
						"code": "24028007",
						"system": "http://snomed.info/sct",
						"display": "RIGHT (QUALIFIER VALUE)"
					}
				]
			}
		}
	],
	"procedureCodes": [
		{
			"extension": [],
			"coding": [
				{
					"code": "48476-6",
					"system": "LOINC PLAYBOOK",
					"display": "XR FOOT - RIGHT GE 3 VIEWS"
				}
			]
		}
	],
	"orderedProcedure": {
		"code": {
			"coding": [
				{
					"code": "A0270629"
				}
			]
		},
		"description": "Foot Complete Min 3 Views, (RT)."
	}
}
```
Field `procedureCodes`, if filled, contains one or more LOINC codes for the procedure. The possible LOINC codes are listed in [Appendix A](#appendix-a-possible-loinc-codes-for-field-procedurecodes).

## Field ImagingProcedures
Mandatory field `imagingProcedures` contains one or more instances of imagingProcedure, with fields `modality`, `anatomy`, `laterality`, `contrast`, and `view`. The first two are mandatory. Fields `modality` and `anatomy` can contain a SNOMED or RadLex concept. Field `laterality` contains a SNOMED concept. Fields `view.code` and `contrast.code` can contain SNOMED or RadLex concepts. Fields `view.types` can contain SNOMED or RadLex codes for the type of view, for example lateral or frontal. `Contrast.types` is currently not filled.  
The possible SNOMED code values for `laterality` are:

| Code | Display |
|---|---|
|51440002|	RIGHT AND LEFT (QUALIFIER VALUE)|
|66459002|	UNILATERAL (QUALIFIER VALUE)|
|24028007|	RIGHT (QUALIFIER VALUE)|
|7771000|	LEFT (QUALIFIER VALUE)|

The possible values for `modality` are in [Appendix B](#appendix-b-possible-codes-for-field-modality-in-imagingprocedures).  
The possible values for `anatomy` are in [Appendix C](#appendix-c-possible-codes-for-field-anatomy-in-imagingprocedures).  
The possible RadLex code values for `contrast.code`:

| Code | Display |
|---|---|
|RID39045|	IMAGING WITH CONTRAST|
|RID28768|	IMAGING WITHOUT IV CONTRAST|
|RID28771|	IMAGING WITHOUT THEN WITH IV CONTRAST|

The possible RadLex code values for `view` are:

| Code | Display |
|---|---|
|RID43399|	1 VIEW|
|RID43403|	2 VIEWS|
|RID43406|	3 VIEWS|
|RID43408|	4 VIEWS|
|RID43559|	5 VIEWS|
|RID50157|	6 VIEWS|
|RID50158|	7 VIEWS|
|RID50159|	8 VIEWS|

The possible radlex code values for view type are in [Appendix D](#appendix-d-possible-radlex-codes-for-field-view-type-in-imagingprocedures).

## Field orderedProcedure

Field `orderedProcedure` contains the description(s) and the code(s) of the ordered procedure(s) as given by the client. The descriptions are in field `orderedProcedure.description`, separated by ";;". The codes are in `orderedProcedure.code.coding`. In every coding in the array, only field "code" is set. Since it’s not known what the coding system is, – it’s often a system that is limited to the hospital of the client – the system field isn't filled in.



## Appendix A: Possible LOINC codes for field procedureCodes

| Code | Display |
|---|---|
| 11525-3 | US for pregnancy |
| 24531-6 | US Retroperitoneum |
| 24532-4 | US Abdomen RUQ |
| 24533-2 | MRA Abdominal vessels W contrast IV |
| 24534-0 | US.doppler Abdominal vessels |
| 24535-7 | XR Acetabulum Views |
| 24536-5 | XR Acromioclavicular Joint Views |
| 24537-3 | US Guidance for aspiration of amniotic fluid of Uterus |
| 24538-1 | MR Ankle |
| 24539-9 | MR Ankle WO and W contrast IV |
| 24540-7 | XR Ankle 2 Views |
| 24541-5 | XR Ankle Views |
| 24542-3 | US Anus |
| 24543-1 | RFA Guidance for angioplasty of Thoracic and abdominal aorta-- W contrast IA |
| 24544-9 | CT Thoracic Aorta |
| 24545-6 | CT Thoracic Aorta W contrast IV |
| 24547-2 | US Thoracic and abdominal aorta |
| 24548-0 | US Appendix |
| 24549-8 | MRA Upper extremity vessels W contrast IV |
| 24550-6 | RFA Upper extremity veins Views W contrast IV |
| 24551-4 | RFA AV fistula Views W contrast IA |
| 24552-2 | RF Stent Views W contrast intra stent |
| 24553-0 | RFA Guidance for embolectomy of Intracranial vessel-- W contrast IV |
| 24554-8 | RFA Guidance for embolization of Artery-- W contrast IA |
| 24555-5 | RFA Guidance for placement of stent in Artery |
| 24556-3 | MR Abdomen |
| 24557-1 | MR Abdomen WO and W contrast IV |
| 24558-9 | US Abdomen |
| 24559-7 | US Guidance for drainage and placement of drainage catheter of Abdomen |
| 24560-5 | Portable XR Abdomen AP left lateral-decubitus |
| 24561-3 | XR Abdomen AP left lateral-decubitus |
| 24562-1 | XR Abdomen Left lateral-decubitus and Right lateral-decubitus |
| 24563-9 | XR Abdomen AP right lateral-decubitus |
| 24564-7 | Portable XR Abdomen AP upright |
| 24566-2 | CT Retroperitoneum |
| 24568-8 | RFA Guidance for atherectomy of AV fistula-- W contrast IV |
| 24569-6 | RFA AV shunt Views W contrast IV |
| 24570-4 | RF Guidance for removal of calculus from Biliary duct common-- W contrast retrograde intra biliary |
| 24571-2 | NM Biliary ducts and Gallbladder Views for patency of biliary structures and ejection fraction W sincalide and W radionuclide IV |
| 24572-0 | NM Biliary ducts and Gallbladder Views for patency of biliary structures W Tc-99m IV |
| 24573-8 | XR Biliary ducts and Gallbladder Views W contrast IV |
| 24574-6 | RF Biliary ducts and Gallbladder Views during surgery W contrast biliary duct |
| 24575-3 | RF Biliary ducts and Gallbladder Views W contrast percutaneous transhepatic |
| 24576-1 | RFA Urinary bladder arteries Views W contrast IA |
| 24577-9 | XR Bone Views during surgery |
| 24578-7 | SPECT Bones |
| 24579-5 | XR Long bones Survey Views |
| 24580-3 | RFA Guidance for angioplasty of Brachiocephalic artery-- W contrast IA |
| 24581-1 | RFA Subclavian artery and Brachial artery Views W contrast IA |
| 24582-9 | MR Brachial plexus |
| 24583-7 | MR Brachial plexus WO and W contrast IV |
| 24584-5 | MRA Thoracic inlet vessels W contrast IV |
| 24585-2 | CT Guidance for stereotactic biopsy of Head-- W contrast IV |
| 24586-0 | MR Brain W anesthesia |
| 24587-8 | MR Brain WO and W contrast IV |
| 24588-6 | MR Brain WO and W contrast IV and W anesthesia |
| 24589-4 | MR Brain W contrast IV |
| 24590-2 | MR Brain |
| 24591-0 | NM Brain Brain death protocol Views W Tc-99m HMPAO IV |
| 24593-6 | MRA Head vessels W contrast IV |
| 24594-4 | MG Guidance for aspiration of cyst of Breast |
| 24595-1 | MG Guidance for needle localization of mass of Breast |
| 24596-9 | US Breast specimen |
| 24597-7 | MG Breast specimen Views |
| 24598-5 | MG Guidance for fluid aspiration of Breast |
| 24599-3 | US Breast limited |
| 24600-9 | US Guidance for needle localization of Breast |
| 24601-7 | US Breast |
| 24602-5 | MG Guidance for biopsy of Breast |
| 24603-3 | MG stereo Guidance for biopsy of Breast |
| 24604-1 | MG Breast Diagnostic Limited Views |
| 24605-8 | MG Breast Diagnostic |
| 24606-6 | MG Breast Screening |
| 24609-0 | MG Guidance for percutaneous biopsy.core needle of Breast |
| 24610-8 | MG Breast Limited Views |
| 24612-4 | XR Calcaneus Views |
| 24614-0 | RFA Guidance for angioplasty of Carotid artery extracranial-- W contrast IA |
| 24615-7 | RFA Guidance for angioplasty of Carotid artery.intracranial-- W contrast IA |
| 24616-5 | US Carotid arteries |
| 24617-3 | RFA Carotid arteries Views W contrast IA |
| 24619-9 | XR Wrist Views |
| 24620-7 | RF Catheter Views for patency check W contrast via catheter |
| 24621-5 | RF Guidance for percutaneous drainage and placement of drainage catheter of Unspecified body region |
| 24622-3 | RFA Celiac artery Views W contrast IA |
| 24623-1 | CT Guidance for nerve block of Celiac plexus |
| 24624-9 | RFA Guidance for change of CV catheter in Vein-- W contrast IV |
| 24625-6 | RFA Guidance for placement of CV catheter in Vein-- W contrast IV |
| 24626-4 | RFA Guidance for reposition of CV catheter in Vein-- W contrast IV |
| 24627-2 | CT Chest |
| 24628-0 | CT Chest W contrast IV |
| 24629-8 | MR Chest |
| 24630-6 | US Chest |
| 24631-4 | RF Unspecified body region Views for central venous catheter placement check |
| 24632-2 | Portable XR Chest Views AP |
| 24634-8 | Portable XR Chest Views W inspiration and expiration |
| 24635-5 | XR Chest PA upright Views W inspiration and expiration |
| 24636-3 | Portable XR Chest AP left lateral-decubitus |
| 24637-1 | XR Chest AP left lateral-decubitus |
| 24638-9 | Portable XR Chest Left lateral upright |
| 24639-7 | XR Chest Left lateral upright |
| 24640-5 | XR Chest Apical lordotic |
| 24641-3 | Portable XR Chest Left oblique |
| 24642-1 | XR Chest AP and PA upright |
| 24643-9 | XR Chest PA and Lateral and Oblique upright |
| 24644-7 | Portable XR Chest PA and Lateral upright |
| 24645-4 | Portable XR Chest PA and Right lateral and Right oblique and Left oblique upright |
| 24646-2 | XR Chest PA and Right lateral and Right oblique and Left oblique upright |
| 24647-0 | XR Chest PA and Lateral upright |
| 24648-8 | XR Chest PA upright |
| 24649-6 | Portable XR Chest Right lateral-decubitus and Left lateral-decubitus |
| 24650-4 | XR Chest Right lateral-decubitus and Left lateral-decubitus |
| 24651-2 | XR Chest Right oblique and Left oblique upright |
| 24652-0 | Portable XR Chest AP right lateral-decubitus |
| 24653-8 | XR Chest AP and AP right lateral-decubitus |
| 24654-6 | Portable XR Chest AP and AP right lateral-decubitus |
| 24655-3 | RF Chest Image intensifier during surgery |
| 24656-1 | RF Chest Single view during surgery |
| 24657-9 | XR tomography Chest |
| 24658-7 | RFA Thoracic and abdominal aorta Views W contrast IA |
| 24659-5 | MRA Chest vessels W contrast IV |
| 24660-3 | MRA Thoracic Aorta |
| 24661-1 | RF Pleural space Views W contrast intra pleural space |
| 24662-9 | US Guidance for fluid aspiration of Pleural space |
| 24663-7 | NM Cerebral cisterns Views W radionuclide IT |
| 24664-5 | XR Clavicle Views |
| 24665-2 | XR Sacrum and Coccyx Views |
| 24666-0 | RF Colon Views W air and barium contrast PR |
| 24667-8 | RF Colon Views W contrast PR |
| 24668-6 | RF Colon Single view for transit Post solid contrast |
| 24669-4 | RF Colon Views W water soluble contrast PR |
| 24670-2 | US Guidance for biopsy of cyst of Unspecified body region |
| 24671-0 | RF Guidance for aspiration of cyst of Unspecified body region |
| 24672-8 | US Diaphragm for motion |
| 24674-4 | MR Elbow |
| 24675-1 | MR Elbow WO and W contrast IV |
| 24676-9 | XR Elbow Views |
| 24677-7 | US Pelvis transvaginal |
| 24678-5 | RF Esophagus Views W contrast PO |
| 24679-3 | RF Esophagus Views W gastrografin PO |
| 24680-1 | RF Guidance for dilation of Esophagus |
| 24681-9 | RF videography Hypopharynx and Esophagus Views |
| 24682-7 | RF videography Hypopharynx and Esophagus Views W liquid and paste contrast PO during swallowing |
| 24683-5 | NM Esophagus+Stomach Views W Tc-99m SC PO |
| 24684-3 | RFA Guidance for embolectomy of Extracranial vessels-- W contrast IA |
| 24685-0 | RFA Peripheral veins Views W contrast IV |
| 24686-8 | XR Lower extremity Views |
| 24687-6 | MR Lower Extremity Joint |
| 24688-4 | MR Upper extremity |
| 24689-2 | XR Upper extremity Views |
| 24690-0 | CT Extremity |
| 24691-8 | CT Extremity W contrast IV |
| 24692-6 | US Guidance for drainage and placement of drainage catheter of Extremity |
| 24693-4 | US Extremity |
| 24694-2 | MR Face WO and W contrast IV |
| 24695-9 | XR Facial bones Views |
| 24696-7 | CT Facial bones |
| 24697-5 | CT Facial bones W contrast IV |
| 24698-3 | RFA Guidance for angioplasty of Femoral artery-- W contrast IA |
| 24699-1 | RFA Femoral artery Runoff W contrast IA |
| 24700-7 | XR Femur and Tibia Views for leg length |
| 24702-3 | MR Thigh |
| 24703-1 | MR Thigh WO and W contrast IV |
| 24704-9 | XR Femur Views |
| 24705-6 | MR Finger |
| 24706-4 | XR Finger Views |
| 24707-2 | MR Foot |
| 24708-0 | XR Foot Views W standing |
| 24709-8 | XR Foot Views |
| 24710-6 | MR Forearm |
| 24711-4 | US Gallbladder |
| 24712-2 | XR Gallbladder Views W contrast PO |
| 24713-0 | XR Gallbladder Views 48H post contrast PO |
| 24714-8 | NM Gastrointestinal tract Views for gastrointestinal bleeding W Tc-99m tagged RBC IV |
| 24715-5 | RF Gastrointestinal tract upper Single view W contrast PO |
| 24716-3 | RF Guidance for placement of decompression tube in Gastrointestinal tract |
| 24718-9 | RF Guidance for transjugular biopsy of Liver-- W contrast IV |
| 24719-7 | US Groin |
| 24720-5 | MR Hand |
| 24721-3 | XR Hand 2 Views |
| 24722-1 | XR Hand 3 Views |
| 24723-9 | XR Hand Arthritis |
| 24724-7 | XR Wrist and Hand Bone age Views |
| 24725-4 | CT Head |
| 24726-2 | CT Head WO and W contrast IV |
| 24727-0 | CT Head W contrast IV |
| 24728-8 | CT perfusion Head |
| 24729-6 | CT perfusion Head WO and W contrast IV |
| 24730-4 | NM Brain Views |
| 24731-2 | US Head |
| 24732-0 | US Head during surgery |
| 24733-8 | US.doppler Head vessels |
| 24734-6 | CT Cerebral cisterns W contrast IT |
| 24735-3 | MR Internal auditory canal and Posterior fossa |
| 24740-3 | MR Internal auditory canal and Posterior fossa WO and W contrast IV |
| 24745-2 | XR Petrous part of temporal bone Views |
| 24748-6 | MR Heart |
| 83289-9 | CT for calcium scoring WO contrast and CTA W contrast IV Heart and coronary arteries |
| 24750-2 | NM Heart Views at rest and W Tl-201 IV |
| 42136-2 | CT Guidance for biopsy of Heart |
| 24751-0 | NM Parathyroid gland Views W TI-201 subtraction Tc-99m IV |
| 24752-8 | RF videography Heart Views |
| 58744-4 | CT Heart |
| 24753-6 | CT Unspecified body region W contrast IV |
| 24755-1 | RFA Guidance for atherectomy of Vein-- W contrast IV |
| 24756-9 | RFA Guidance for placement of stent in Vein |
| 24760-1 | US Hip |
| 24761-9 | XR Hip Single view |
| 24762-7 | XR Hip Views |
| 24764-3 | RF Hip Arthrogram |
| 24765-0 | XR Humerus 2 Views |
| 24766-8 | RFA Guidance for angioplasty of Iliac artery-- W contrast IA |
| 24767-6 | XR tomography Internal auditory canal |
| 24769-2 | CT Guidance for injection of Joint space |
| 24770-0 | NM Joint Views W In-111 intrajoint |
| 24771-8 | RF Guidance for arthrocentesis of Joint space |
| 24772-6 | US Guidance for biopsy of Kidney |
| 24773-4 | NM Kidney Views W radionuclide transplant scan |
| 24776-7 | NM Kidney Views |
| 24778-3 | XR Kidney - bilateral 3 Serial Views WO and W contrast IV |
| 24779-1 | RF Guidance for percutaneous placement of nephrostomy tube of Kidney - bilateral-- W contrast via tube |
| 24780-9 | RF Kidney - bilateral Views W contrast via nephrostomy tube |
| 24781-7 | RF Guidance for exchange of nephrostomy tube of Kidney - bilateral-- W contrast |
| 24782-5 | RF Guidance for percutaneous placement of nephroureteral stent of Kidney - bilateral-- W contrast via stent |
| 24783-3 | RF Kidney - bilateral Views for urodynamics |
| 24784-1 | XR tomography Kidney - bilateral WO and W contrast IV |
| 24787-4 | XR tomography Kidney - bilateral WO contrast and 10M post contrast IV |
| 24788-2 | XR Kidney - bilateral Views W contrast IV |
| 24789-0 | XR tomography Kidney - bilateral |
| 24790-8 | XR tomography Kidney - bilateral W contrast IV |
| 24792-4 | Portable XR Abdomen AP and AP left lateral-decubitus |
| 24793-2 | Portable XR Abdomen AP and Lateral |
| 24794-0 | XR Abdomen AP and Lateral |
| 24795-7 | Portable XR Abdomen Supine and Upright |
| 24796-5 | XR Abdomen AP and AP left lateral-decubitus |
| 24797-3 | XR Abdomen AP and Oblique prone |
| 24798-1 | XR Abdomen Supine and Upright |
| 24799-9 | XR Abdomen AP |
| 24800-5 | RF Knee Arthrogram |
| 24801-3 | XR Knee Merchants |
| 24802-1 | MR Knee |
| 24803-9 | MR Knee WO and W contrast IV |
| 24804-7 | NM Knee Views |
| 24805-4 | XR Knee AP and Lateral W standing |
| 24806-2 | XR Knee 2 Views |
| 24807-0 | XR Knee AP W standing |
| 24808-8 | XR Knee AP and PA W standing |
| 24809-6 | XR Knee Views W standing |
| 24811-2 | CT Guidance for fluid aspiration of Liver |
| 24812-0 | CT Guidance for biopsy of Liver |
| 24813-8 | CT Guidance for core needle biopsy of Liver |
| 24814-6 | CT Liver |
| 24815-3 | CT Liver W contrast IV |
| 24816-1 | US Guidance for biopsy of Liver |
| 24817-9 | SPECT Liver W Tc-99m IV |
| 24818-7 | US Diaphragm and Liver |
| 24820-3 | MRA Lower leg vessels W contrast IV |
| 24821-1 | MR Lower leg |
| 24822-9 | CT Guidance for fluid aspiration of Lung |
| 24823-7 | CT Guidance for biopsy of Lung |
| 24824-5 | NM Lung Portable Views |
| 24825-2 | XR Lung Views W contrast intrabronchial |
| 24826-0 | NM Lymphatic vessels Views W radionuclide intra lymphatic |
| 24827-8 | RFA Lymphatic vessels Views W contrast intra lymphatic |
| 24828-6 | XR tomography Mandible Panoramic |
| 24829-4 | XR Mandible Views |
| 24830-2 | XR Mastoid Views |
| 24831-0 | NM Small bowel Views for Meckel's diverticulum W Tc-99m M04 IV |
| 24832-8 | RFA Guidance for angioplasty of Mesenteric artery-- W contrast IA |
| 24833-6 | RFA Mesenteric artery Views W contrast IA |
| 24834-4 | XR Nasal bones Views |
| 24835-1 | CT Nasopharynx and Neck |
| 24836-9 | CT Nasopharynx and Neck W contrast IV |
| 24837-7 | CT Guidance for fluid aspiration of Neck |
| 24838-5 | CT Guidance for biopsy of Neck |
| 24839-3 | MR Neck |
| 24840-1 | MR Neck WO and W contrast IV |
| 24841-9 | MR Neck W contrast IV |
| 24842-7 | US Neck |
| 24843-5 | XR Neck Lateral |
| 24844-3 | MRA Neck vessels W contrast IV |
| 24845-0 | RF Neck Views W contrast intra larynx |
| 24846-8 | XR Optic foramen Views |
| 24848-4 | CT Orbit - bilateral |
| 24849-2 | CT Orbit - bilateral WO and W contrast IV |
| 24850-0 | CT Orbit - bilateral W contrast IV |
| 24851-8 | MR Orbit - bilateral WO and W contrast IV |
| 24852-6 | MR Orbit - bilateral W contrast IV |
| 24854-2 | XR Orbit - bilateral Views |
| 24855-9 | RF videography Oropharynx Views |
| 24856-7 | CT Guidance for fluid aspiration of Pancreas |
| 24857-5 | CT Pancreas |
| 24858-3 | CT Pancreas W contrast IV |
| 24859-1 | US Pancreas |
| 24860-9 | RFA Pancreatic artery Views W contrast IA |
| 24861-7 | XR Patella 2 Views |
| 24862-5 | RFA Iliac artery Internal Views W contrast IA |
| 24863-3 | CT Guidance for fluid aspiration of Pelvis |
| 24864-1 | CT Guidance for biopsy of Pelvis |
| 24865-8 | CT Pelvis |
| 24866-6 | CT Pelvis W contrast IV |
| 24867-4 | MR Pelvis |
| 24868-2 | US Guidance for drainage and placement of drainage catheter of Pelvis |
| 24869-0 | US Pelvis |
| 24870-8 | US.doppler Pelvis vessels |
| 24871-6 | XR Pelvis Pelvimetry |
| 24872-4 | MR Pelvis and Hip |
| 24873-2 | MRA Pelvis vessels W contrast IV |
| 24874-0 | RFA Peripheral arteries Views W contrast IA |
| 24876-5 | NM Head to Pelvis Views for shunt patency W Tc-99m DTPA IT |
| 24877-3 | CT Petrous part of temporal bone |
| 24878-1 | CT Petrous part of temporal bone W contrast IV |
| 24879-9 | MR Pituitary and Sella turcica WO and W contrast IV |
| 24880-7 | MR Pituitary and Sella turcica |
| 24881-5 | US Popliteal space |
| 24882-3 | RFA Guidance for percutaneous transluminal angioplasty of Popliteal artery-- W contrast IA |
| 24883-1 | US Guidance for percutaneous biopsy of Prostate |
| 24884-9 | US Prostate transrectal |
| 24887-2 | RFA Guidance for embolectomy of Pulmonary arteries-- W contrast IA |
| 24888-0 | NM Pulmonary system Ventilation and Perfusion W Xe-133 IH and W Tc-99m MAA IV |
| 24889-8 | US Pylorus for pyloric stenosis |
| 24891-4 | XR Radius and Ulna Views |
| 24892-2 | US Rectum |
| 24893-0 | RF Rectum Single view post contrast PR during defecation |
| 24894-8 | RF Rectum and Urinary bladder Views W contrast PR and intra bladder during defecation and voiding |
| 24896-3 | US Guidance for drainage and placement of drainage catheter of Kidney |
| 24899-7 | XR Ribs Views |
| 24900-3 | XR Sacroiliac Joint Views |
| 24901-1 | CT Guidance for injection of Sacroiliac Joint |
| 24902-9 | RF Salivary gland Views W contrast intra salivary duct |
| 24903-7 | XR Scapula Views |
| 24904-5 | CT Pituitary and Sella turcica WO and W contrast IV |
| 24905-2 | MR Shoulder |
| 24906-0 | MR Shoulder WO and W contrast IV |
| 24907-8 | US Shoulder |
| 24908-6 | XR Shoulder 3 Views |
| 24909-4 | XR Shoulder Views |
| 24910-2 | RF Shoulder Arthrogram |
| 24911-0 | RF Shunt Views |
| 24912-8 | RF Sinus tract Views W contrast intra sinus tract |
| 24913-6 | CT Sinuses limited |
| 24914-4 | MR Sinuses |
| 24915-1 | MR Sinuses W contrast IV |
| 24916-9 | XR Sinuses Views |
| 24917-7 | XR Skull Single view |
| 24918-5 | XR Skull 3 Views |
| 24919-3 | XR Skull AP and Lateral |
| 24920-1 | XR Skull Lateral |
| 24921-9 | XR Skull Waters |
| 24922-7 | XR Skull 5 Views |
| 24923-5 | RF Small bowel Views W positive contrast via enteroclysis tube |
| 24924-3 | RF Small bowel Views W contrast PO |
| 24925-0 | RFA Spinal artery Views W contrast IA |
| 24926-8 | US Spine |
| 24927-6 | RF Spine Views W contrast intradisc |
| 24928-4 | XR Spine AP and Lateral |
| 24929-2 | XR Thoracic and lumbar spine Views for scoliosis W flexion and W extension |
| 24930-0 | XR Thoracic and lumbar spine Views for scoliosis |
| 24931-8 | RF Guidance for injection of Spine facet joint |
| 24932-6 | CT Cervical spine |
| 24933-4 | CT Cervical spine W contrast IV |
| 24934-2 | CT Cervical spine W contrast IT |
| 24935-9 | MR Cervical spine |
| 24936-7 | MR Cervical spine W anesthesia |
| 24937-5 | MR Cervical spine WO and W contrast IV |
| 24938-3 | MR Cervical spine W contrast IV |
| 24939-1 | XR Cervical spine 5 Views |
| 24940-9 | XR Cervical spine Single view |
| 24941-7 | XR Cervical spine 3 Views |
| 24942-5 | XR Cervical spine AP and Lateral |
| 24943-3 | XR Cervical spine Lateral |
| 24944-1 | XR Cervical spine Swimmers |
| 24945-8 | XR Cervical spine Views W flexion and W extension |
| 24946-6 | XR Cervical spine Views |
| 24947-4 | RF Cervical spine Views W contrast IT |
| 24948-2 | XR Spine Cervical Odontoid and Cervical axis AP |
| 24963-1 | CT Lumbar spine |
| 24964-9 | CT Lumbar spine W contrast IV |
| 24965-6 | CT Lumbar spine W contrast IT |
| 24967-2 | MR Lumbar spine WO and W contrast IV |
| 24968-0 | MR Lumbar spine |
| 24969-8 | XR Lumbar spine Lateral |
| 24970-6 | XR Lumbar spine AP and Lateral |
| 24971-4 | XR Lumbar spine Views W flexion and W extension |
| 24972-2 | XR Lumbar spine Views |
| 24973-0 | RF Guidance for fluid aspiration of Lumbar spine space |
| 24974-8 | RF Lumbar spine Views W contrast IT |
| 24975-5 | XR Spine.lumbar and Sacroiliac joint - bilateral Views |
| 24977-1 | MR Lumbar spine W anesthesia |
| 24978-9 | CT Thoracic spine |
| 24979-7 | CT Thoracic spine W contrast IV |
| 24980-5 | MR Thoracic spine |
| 24981-3 | MR Thoracic spine WO and W contrast IV |
| 24982-1 | MR Thoracic spine W contrast IV |
| 24983-9 | XR Thoracic spine Views |
| 24984-7 | XR Thoracic and lumbar spine 2 Views |
| 24985-4 | RF Thoracic spine Views W contrast IT |
| 24986-2 | CT Guidance for biopsy of Spine |
| 24987-0 | CT Spine W contrast IV |
| 24988-8 | CT Spleen |
| 24989-6 | CT Spleen WO and W contrast IV |
| 24990-4 | US Spleen |
| 24991-2 | RFA Splenic vein and Portal vein Views W contrast IA |
| 24992-0 | RFA Splenic artery Views W contrast IA |
| 24994-6 | XR Sternum Views |
| 24995-3 | RF Guidance for placement of tube in Stomach |
| 24996-1 | RF Guidance for percutaneous replacement of gastrostomy of Stomach |
| 24997-9 | NM Stomach Views for gastric emptying solid phase W Tc-99m SC PO |
| 24998-7 | RF Placement check of gastrostomy tube W contrast via GI tube |
| 24999-5 | MR Temporomandibular joint |
| 25000-1 | XR Temporomandibular joint Views |
| 25001-9 | NM Scrotum and testicle Views W Tc-99m pertechnetate IV |
| 25002-7 | US Scrotum and testicle |
| 25003-5 | MRA Thigh vessels W contrast IV |
| 25005-0 | RFA Three vessels Views W contrast |
| 25006-8 | XR Thumb Views |
| 25007-6 | NM Thyroid gland Views W I-131 IV |
| 25008-4 | NM Thyroid gland Views and Views uptake W I-131 IV |
| 25009-2 | US Guidance for biopsy of Thyroid gland |
| 25010-0 | US Thyroid gland |
| 25011-8 | XR Tibia and Fibula Views |
| 25013-4 | XR Toes Views |
| 25014-2 | RFA Two vessels Views W contrast |
| 25016-7 | RF Urethra Views W contrast intra urethra |
| 25017-5 | RF Urinary bladder and Urethra Views W contrast intra bladder |
| 25018-3 | NM Urinary bladder Views |
| 25019-1 | US Urinary bladder |
| 25020-9 | RF Urinary bladder and Urethra Views W contrast retrograde via urethra |
| 25022-5 | RF Uterus and Fallopian tubes Views W contrast IU |
| 25023-3 | RFA Vein Views W contrast IV |
| 25024-1 | RFA Guidance for placement of peripherally-inserted central venous catheter in Vein |
| 25025-8 | RFA Vena cava Views W contrast IV |
| 25026-6 | RFA Guidance for placement of venous filter in Inferior vena cava-- W contrast IV |
| 25027-4 | Guidance for placement of large bore CV catheter in Vein |
| 25028-2 | RFA Guidance for placement of catheter for infusion of thrombolytic in Vessel-- W contrast intravascular |
| 25029-0 | RFA Guidance for placement of catheter for vasoconstrictor infusion in Vessels |
| 25030-8 | RFA Abdominal arteries Views W contrast IA |
| 25031-6 | NM Bone Views |
| 25032-4 | NM Bone Views W In-111 tagged WBC IV |
| 25033-2 | MR Wrist |
| 25034-0 | RF Wrist Arthrogram |
| 25035-7 | MR Wrist WO and W contrast IV |
| 25036-5 | US Wrist |
| 25039-9 | CT Unspecified body region limited |
| 25041-5 | CT Guidance for aspiration or biopsy of Unspecified body region-- W contrast IV |
| 25042-3 | CT Guidance for aspiration or biopsy of Unspecified body region |
| 25043-1 | CT Guidance for fluid aspiration of Unspecified body region |
| 25044-9 | CT Guidance for biopsy of Unspecified body region |
| 25045-6 | CT Unspecified body region |
| 25046-4 | CT Unspecified body region W anesthesia |
| 25047-2 | CT Unspecified body region W conscious sedation |
| 25053-0 | CT Guidance for radiosurgery of Unspecified body region |
| 25054-8 | CT Guidance for radiosurgery of Unspecified body region-- W contrast IV |
| 25056-3 | MR Unspecified body region |
| 25057-1 | MR Unspecified body region W conscious sedation |
| 25058-9 | MRA Unspecified body region W contrast IV |
| 25059-7 | US Guidance for biopsy of Unspecified body region |
| 25060-5 | US Unspecified body region No charge |
| 25061-3 | US Unspecified body region |
| 25062-1 | XR Unspecified body region Comparison view |
| 25063-9 | RFA Vessel Single view W contrast IA |
| 25064-7 | RFA Vessel Views for angioplasty W contrast IA |
| 25065-4 | RF 15 minutes |
| 25066-2 | RF 30 minutes |
| 25067-0 | RF 45 minutes |
| 25068-8 | RF 1 hour |
| 25069-6 | RF Guidance for biopsy of Unspecified body region |
| 25070-4 | RF Unspecified body region Views during surgery |
| 25071-2 | XR tomography Unspecified body region |
| 25072-0 | Guidance for placement of infusion port |
| 25073-8 | RFA Guidance for removal of foreign body from Vessel |
| 25074-6 | XR Zygomatic arch Views |
| 25076-1 | RFA Hepatic artery Views W contrast IA |
| 25077-9 | RFA Guidance for placement of catheter in Hepatic artery-- W contrast IA |
| 25078-7 | RF Guidance for placement of stent in Intrahepatic portal system |
| 25079-5 | RFA Renal arteries Views W contrast IA |
| 25080-3 | RFA Renal vein - bilateral Views for renin sampling W contrast IV |
| 25081-1 | RFA Guidance for angioplasty of Renal vessel-- W contrast IA |
| 26064-6 | RFA Vein - bilateral Views W contrast IV |
| 26065-3 | RFA Vein - left Views W contrast IV |
| 26066-1 | RFA Vein - right Views W contrast IV |
| 26067-9 | RF Salivary gland - bilateral Views W contrast intra salivary duct |
| 26068-7 | RF Salivary gland - left Views W contrast intra salivary duct |
| 26069-5 | RF Salivary gland - right Views W contrast intra salivary duct |
| 26070-3 | RF Hip - bilateral Arthrogram |
| 26071-1 | RF Hip - left Arthrogram |
| 26072-9 | RF Hip - right Arthrogram |
| 26073-7 | RF Knee - bilateral Arthrogram |
| 26074-5 | RF Knee - left Arthrogram |
| 26075-2 | RF Knee - right Arthrogram |
| 26076-0 | RF Shoulder - bilateral Arthrogram |
| 26077-8 | RF Shoulder - left Arthrogram |
| 26078-6 | RF Shoulder - right Arthrogram |
| 26079-4 | RFA Carotid arteries - bilateral Views W contrast IA |
| 26080-2 | RFA Carotid arteries - left Views W contrast IA |
| 26081-0 | RFA Carotid arteries -right Views W contrast IA |
| 26082-8 | RFA Spinal artery - bilateral Views W contrast IA |
| 26083-6 | RFA Spinal artery - left Views W contrast IA |
| 26084-4 | RFA Spinal artery - right Views W contrast IA |
| 26085-1 | XR Knee - bilateral Views W standing |
| 26086-9 | XR Knee - left Views W standing |
| 26087-7 | XR Knee - right Views W standing |
| 26088-5 | NM Knee - bilateral Views |
| 26089-3 | NM Knee - left Views |
| 26090-1 | NM Knee - right Views |
| 26091-9 | NM Scrotum and Testicle - bilateral Views W Tc-99m pertechnetate IV |
| 26092-7 | NM Scrotum and Testicle - left Views W Tc-99m pertechnetate IV |
| 26093-5 | NM Scrotum and Testicle - right Views W Tc-99m pertechnetate IV |
| 26094-3 | XR Foot - bilateral Views W standing |
| 26095-0 | XR Foot - left Views W standing |
| 26096-8 | XR Foot - right Views W standing |
| 26097-6 | XR Ankle - bilateral Views |
| 26098-4 | XR Ankle - left Views |
| 26099-2 | XR Ankle - right Views |
| 26100-8 | XR Calcaneus - bilateral Views |
| 26101-6 | XR Calcaneus - left Views |
| 26102-4 | XR Calcaneus - right Views |
| 26106-5 | XR Clavicle - bilateral Views |
| 26107-3 | XR Clavicle - left Views |
| 26108-1 | XR Clavicle - right Views |
| 26109-9 | XR Elbow - bilateral Views |
| 26110-7 | XR Elbow - left Views |
| 26111-5 | XR Elbow - right Views |
| 26112-3 | XR Lower extremity - bilateral Views |
| 26113-1 | XR Lower extremity - left Views |
| 26114-9 | XR Lower extremity - right Views |
| 26115-6 | XR Upper extremity - bilateral Views |
| 26116-4 | XR Upper extremity - left Views |
| 26117-2 | XR Upper extremity - right Views |
| 26118-0 | XR Femur - bilateral Views |
| 26120-6 | XR Femur - left Views |
| 26122-2 | XR Femur - right Views |
| 26124-8 | XR Finger - bilateral Views |
| 26125-5 | XR Finger - left Views |
| 26126-3 | XR Finger - right Views |
| 26127-1 | XR Foot - bilateral Views |
| 26128-9 | XR Foot - left Views |
| 26129-7 | XR Foot - right Views |
| 26130-5 | XR Hip - bilateral Views |
| 26131-3 | XR Hip - left Views |
| 26132-1 | XR Hip - right Views |
| 26133-9 | XR Acetabulum - bilateral Views |
| 26134-7 | XR Acetabulum - left Views |
| 26135-4 | XR Acetabulum - right Views |
| 26136-2 | XR Acromioclavicular joint - bilateral Views |
| 26137-0 | XR Acromioclavicular joint - left Views |
| 26138-8 | XR Acromioclavicular joint - right Views |
| 26139-6 | XR Mastoid - bilateral Views |
| 26140-4 | XR Mastoid - left Views |
| 26141-2 | XR Mastoid - right Views |
| 26142-0 | XR Optic foramen - bilateral Views |
| 26143-8 | XR Optic foramen - left Views |
| 26144-6 | XR Optic foramen - right Views |
| 26146-1 | XR Radius and Ulna - bilateral Views |
| 26148-7 | XR Radius and Ulna - left Views |
| 26150-3 | XR Radius and Ulna - right Views |
| 26151-1 | XR Ribs - bilateral Views |
| 26152-9 | XR Ribs - left Views |
| 26153-7 | XR Ribs - right Views |
| 26154-5 | XR Scapula - bilateral Views |
| 26155-2 | XR Scapula - left Views |
| 26156-0 | XR Scapula - right Views |
| 26157-8 | XR Shoulder - bilateral Views |
| 26158-6 | XR Shoulder - left Views |
| 26159-4 | XR Shoulder - right Views |
| 26160-2 | XR Thumb - bilateral Views |
| 26161-0 | XR Thumb - left Views |
| 26162-8 | XR Thumb - right Views |
| 26163-6 | XR Tibia and Fibula - bilateral Views |
| 26164-4 | XR Tibia and Fibula - left Views |
| 26165-1 | XR Tibia and Fibula - right Views |
| 26166-9 | XR Toes - bilateral Views |
| 26167-7 | XR Toes - left Views |
| 26168-5 | XR Toes - right Views |
| 26169-3 | XR Wrist - bilateral Views |
| 26170-1 | XR Wrist - left Views |
| 26171-9 | XR Wrist - right Views |
| 26172-7 | XR Zygomatic arch - bilateral Views |
| 26173-5 | XR Zygomatic arch - left Views |
| 26174-3 | XR Zygomatic arch - right Views |
| 26175-0 | MG Breast - bilateral Screening |
| 26176-8 | MG Breast - left Screening |
| 26177-6 | MG Breast - right Screening |
| 26178-4 | RFA Femoral artery - bilateral Runoff W contrast IA |
| 26179-2 | RFA Femoral artery - left Runoff W contrast IA |
| 26180-0 | RFA Femoral artery - right Runoff W contrast IA |
| 26181-8 | MRA Thoracic inlet vessels - bilateral W contrast IV |
| 26182-6 | MRA Thoracic inlet vessels - left W contrast IV |
| 26183-4 | MRA Thoracic inlet vessels - right W contrast IV |
| 26184-2 | CT Extremity - bilateral W contrast IV |
| 26185-9 | CT Extremity - left W contrast IV |
| 26186-7 | CT Extremity - right W contrast IV |
| 26187-5 | MR Ankle - bilateral WO and W contrast IV |
| 26188-3 | MR Ankle - left WO and W contrast IV |
| 26189-1 | MR Ankle - right WO and W contrast IV |
| 26190-9 | MR Brachial plexus - bilateral WO and W contrast IV |
| 26191-7 | MR Brachial plexus - left WO and W contrast IV |
| 26192-5 | MR Brachial plexus - right WO and W contrast IV |
| 26193-3 | MR Elbow - bilateral WO and W contrast IV |
| 26194-1 | MR Elbow - left WO and W contrast IV |
| 26195-8 | MR Elbow - right WO and W contrast IV |
| 26196-6 | MR Thigh - bilateral WO and W contrast IV |
| 26197-4 | MR Thigh - left WO and W contrast IV |
| 26198-2 | MR Thigh - right WO and W contrast IV |
| 26199-0 | MR Knee - bilateral WO and W contrast IV |
| 26200-6 | MR Knee - left WO and W contrast IV |
| 26201-4 | MR Knee - right WO and W contrast IV |
| 26202-2 | MR Shoulder - bilateral WO and W contrast IV |
| 26203-0 | MR Shoulder - left WO and W contrast IV |
| 26204-8 | MR Shoulder - right WO and W contrast IV |
| 26205-5 | MR Wrist - bilateral WO and W contrast IV |
| 26206-3 | MR Wrist - left WO and W contrast IV |
| 26207-1 | MR Wrist - right WO and W contrast IV |
| 26208-9 | MR Ankle - bilateral |
| 26209-7 | MR Ankle - left |
| 26210-5 | MR Ankle - right |
| 26211-3 | MR Brachial plexus - bilateral |
| 26212-1 | MR Brachial plexus - left |
| 26213-9 | MR Brachial plexus - right |
| 26214-7 | US Breast - bilateral |
| 26215-4 | US Breast - left |
| 26216-2 | US Breast - right |
| 26217-0 | US Carotid arteries - bilateral |
| 26218-8 | US Carotid arteries - left |
| 26218-8 |  bil |
| 26219-6 | US Carotid arteries -right |
| 26220-4 | MR Elbow - bilateral |
| 26221-2 | MR Elbow - left |
| 26222-0 | MR Elbow - right |
| 26223-8 | US Extremity - bilateral |
| 26224-6 | CT Extremity - bilateral |
| 26225-3 | US Extremity - left |
| 26226-1 | CT Extremity - left |
| 26227-9 | MR Lower extremity joint - bilateral |
| 26228-7 | MR Lower extremity joint - left |
| 26229-5 | MR Lower extremity joint - right |
| 26230-3 | US Extremity - right |
| 26231-1 | CT Extremity - right |
| 26232-9 | MR Upper extremity - bilateral |
| 26233-7 | MR Upper extremity - left |
| 26234-5 | MR Upper extremity - right |
| 26235-2 | MR Thigh - bilateral |
| 26236-0 | MR Thigh - left |
| 26237-8 | MR Thigh - right |
| 26238-6 | MR Finger - bilateral |
| 26239-4 | MR Finger - left |
| 26240-2 | MR Finger - right |
| 26241-0 | MR Foot - bilateral |
| 26242-8 | MR Foot - left |
| 26243-6 | MR Foot - right |
| 26244-4 | MR Forearm - bilateral |
| 26245-1 | MR Forearm - left |
| 26246-9 | MR Forearm - right |
| 26247-7 | MR Hand - bilateral |
| 26248-5 | MR Hand - left |
| 26249-3 | MR Hand - right |
| 26250-1 | US Hip - bilateral |
| 26251-9 | US Hip - left |
| 26252-7 | US Hip - right |
| 26253-5 | XR tomography Internal auditory canal - bilateral |
| 26254-3 | XR tomography Internal auditory canal - left |
| 26255-0 | XR tomography Internal auditory canal - right |
| 26256-8 | MR Knee - bilateral |
| 26257-6 | MR Knee - left |
| 26258-4 | MR Knee - right |
| 26259-2 | MR Pelvis and Hip - bilateral |
| 26260-0 | MR Pelvis and Hip - left |
| 26261-8 | MR Pelvis and Hip - right |
| 26262-6 | US Popliteal space - bilateral |
| 26263-4 | US Popliteal space - left |
| 26264-2 | US Popliteal space - right |
| 26265-9 | US Shoulder - bilateral |
| 26266-7 | MR Shoulder - bilateral |
| 26267-5 | US Shoulder - left |
| 26268-3 | MR Shoulder - left |
| 26269-1 | US Shoulder - right |
| 26270-9 | MR Shoulder - right |
| 26271-7 | US Scrotum and Testicle - bilateral |
| 26272-5 | US Scrotum and Testicle - left |
| 26273-3 | US Scrotum and Testicle - right |
| 26277-4 | MR Wrist - bilateral |
| 26278-2 | US Wrist - bilateral |
| 26279-0 | MR Wrist - left |
| 26280-8 | US Wrist - left |
| 26281-6 | MR Wrist - right |
| 26282-4 | US Wrist - right |
| 26283-2 | XR Knee - bilateral Merchants |
| 26284-0 | XR Knee - left Merchants |
| 26285-7 | XR Knee - right Merchants |
| 26286-5 | US Breast - bilateral limited |
| 26287-3 | MG Breast - bilateral Limited Views |
| 26288-1 | US Breast - left limited |
| 26289-9 | MG Breast - left Limited Views |
| 26290-7 | US Breast - right limited |
| 26291-5 | MG Breast - right Limited Views |
| 26292-3 | MG stereo Guidance for biopsy of Breast - bilateral |
| 26293-1 | MG stereo Guidance for biopsy of Breast - left |
| 26294-9 | MG stereo Guidance for biopsy of Breast - right |
| 26295-6 | RFA Guidance for reposition of CV catheter in Vein - bilateral-- W contrast IV |
| 26296-4 | RFA Guidance for reposition of CV catheter in Vein - left-- W contrast IV |
| 26297-2 | RFA Guidance for reposition of CV catheter in Vein - right-- W contrast IV |
| 26298-0 | RFA Guidance for atherectomy of Vein - bilateral-- W contrast IV |
| 26299-8 | RFA Guidance for atherectomy of Vein - left-- W contrast IV |
| 26300-4 | RFA Guidance for atherectomy of Vein - right-- W contrast IV |
| 26301-2 | RFA Guidance for placement of stent in Vein - bilateral |
| 26302-0 | RFA Guidance for placement of stent in Vein - left |
| 26303-8 | RFA Guidance for placement of stent in Vein - right |
| 26304-6 | RFA Guidance for placement of peripherally-inserted central venous catheter in Vein - bilateral |
| 26305-3 | RFA Guidance for placement of peripherally-inserted central venous catheter in Vein - left |
| 26306-1 | RFA Guidance for placement of peripherally-inserted central venous catheter in Vein - right |
| 26307-9 | Guidance for placement of large bore CV catheter in Vein - bilateral |
| 26308-7 | Guidance for placement of large bore CV catheter in Vein - left |
| 26309-5 | Guidance for placement of large bore CV catheter in Vein - right |
| 26310-3 | RFA Guidance for placement of CV catheter in Vein - bilateral-- W contrast IV |
| 26311-1 | RFA Guidance for placement of CV catheter in Vein - left-- W contrast IV |
| 26312-9 | RFA Guidance for placement of CV catheter in Vein - right-- W contrast IV |
| 26313-7 | US Guidance for needle localization of Breast - bilateral |
| 26314-5 | US Guidance for needle localization of Breast - left |
| 26315-2 | MG Guidance for needle localization of mass of Breast - bilateral |
| 26316-0 | MG Guidance for needle localization of mass of Breast - left |
| 26317-8 | MG Guidance for needle localization of mass of Breast - right |
| 26318-6 | US Guidance for needle localization of Breast - right |
| 26319-4 | CT Guidance for injection of Sacroiliac joint - bilateral |
| 26320-2 | CT Guidance for injection of Sacroiliac joint - left |
| 26321-0 | CT Guidance for injection of Sacroiliac joint - right |
| 26322-8 | RF Guidance for injection of Spine facet joint - bilateral |
| 26323-6 | RF Guidance for injection of Spine facet joint - left |
| 26324-4 | RF Guidance for injection of Spine facet joint - right |
| 26325-1 | US Guidance for drainage and placement of drainage catheter of Extremity - bilateral |
| 26326-9 | US Guidance for drainage and placement of drainage catheter of Extremity - left |
| 26327-7 | US Guidance for drainage and placement of drainage catheter of Extremity - right |
| 26328-5 | US Guidance for drainage and placement of drainage catheter of Kidney - bilateral |
| 26329-3 | US Guidance for drainage and placement of drainage catheter of Kidney - left |
| 26330-1 | US Guidance for drainage and placement of drainage catheter of Kidney - right |
| 26331-9 | RFA Guidance for change of CV catheter in Vein - bilateral-- W contrast IV |
| 26332-7 | RFA Guidance for change of CV catheter in Vein - left-- W contrast IV |
| 26333-5 | RFA Guidance for change of CV catheter in Vein - right-- W contrast IV |
| 26334-3 | MG Guidance for percutaneous biopsy.core needle of Breast - bilateral |
| 26335-0 | MG Guidance for percutaneous biopsy.core needle of Breast - left |
| 26336-8 | MG Guidance for percutaneous biopsy.core needle of Breast - right |
| 26337-6 | MG Guidance for biopsy of Breast - bilateral |
| 26338-4 | MG Guidance for biopsy of Breast - left |
| 26339-2 | MG Guidance for biopsy of Breast - right |
| 26340-0 | US Guidance for biopsy of Kidney - bilateral |
| 26341-8 | US Guidance for biopsy of Kidney - left |
| 26342-6 | US Guidance for biopsy of Kidney - right |
| 26343-4 | MG Guidance for aspiration of cyst of Breast - bilateral |
| 26344-2 | MG Guidance for aspiration of cyst of Breast - left |
| 26345-9 | MG Guidance for aspiration of cyst of Breast - right |
| 26346-7 | MG Breast - bilateral Diagnostic |
| 26347-5 | MG Breast - left Diagnostic |
| 26348-3 | MG Breast - right Diagnostic |
| 26349-1 | MG Breast - bilateral Diagnostic Limited Views |
| 26350-9 | MG Breast - left Diagnostic Limited Views |
| 26351-7 | MG Breast - right Diagnostic Limited Views |
| 26352-5 | XR Wrist - bilateral and Hand - bilateral Bone age Views |
| 26353-3 | XR Wrist - left and Hand - left Bone age Views |
| 26354-1 | XR Wrist - right and Hand - right Bone age Views |
| 26355-8 | XR Hand - bilateral Arthritis |
| 26356-6 | XR Hand - left Arthritis |
| 26357-4 | XR Hand - right Arthritis |
| 26358-2 | XR Knee - bilateral AP W standing |
| 26359-0 | XR Knee - left AP W standing |
| 26360-8 | XR Knee - right AP W standing |
| 26361-6 | XR Knee - bilateral AP and PA W standing |
| 26362-4 | XR Knee - left AP and PA W standing |
| 26363-2 | XR Knee - right AP and PA W standing |
| 26364-0 | XR Knee - bilateral AP and Lateral W standing |
| 26365-7 | XR Knee - left AP and Lateral W standing |
| 26366-5 | XR Knee - right AP and Lateral W standing |
| 26370-7 | RFA Guidance for angioplasty of Iliac artery - bilateral-- W contrast IA |
| 26371-5 | RFA Guidance for angioplasty of Iliac artery - left-- W contrast IA |
| 26372-3 | RFA Guidance for angioplasty of Iliac artery - right-- W contrast IA |
| 26379-8 | XR Hand - bilateral 3 Views |
| 26380-6 | XR Hand - left 3 Views |
| 26381-4 | XR Hand - right 3 Views |
| 26382-2 | XR Shoulder - bilateral 3 Views |
| 26383-0 | XR Shoulder - left 3 Views |
| 26384-8 | XR Shoulder - right 3 Views |
| 26385-5 | XR Ankle - bilateral 2 Views |
| 26386-3 | XR Ankle - left 2 Views |
| 26387-1 | XR Ankle - right 2 Views |
| 26388-9 | XR Hand - bilateral 2 Views |
| 26389-7 | XR Hand - left 2 Views |
| 26390-5 | XR Hand - right 2 Views |
| 26391-3 | XR Humerus - bilateral 2 Views |
| 26392-1 | XR Humerus - left 2 Views |
| 26393-9 | XR Humerus - right 2 Views |
| 26394-7 | XR Knee - bilateral 2 Views |
| 26395-4 | XR Knee - left 2 Views |
| 26396-2 | XR Knee - right 2 Views |
| 26397-0 | XR Patella - bilateral 2 Views |
| 26398-8 | XR Patella - left 2 Views |
| 26399-6 | XR Patella - right 2 Views |
| 26400-2 | XR Hip - bilateral Single view |
| 26401-0 | XR Hip - left Single view |
| 26402-8 | XR Hip - right Single view |
| 28561-9 | XR Pelvis Views |
| 28564-3 | XR Skull Views |
| 28565-0 | XR Knee Views |
| 28566-8 | CT Spine |
| 28567-6 | XR Humerus Views |
| 28576-7 | MR Joint |
| 28582-5 | XR Hand Views |
| 28613-8 | XR Spine Views |
| 28614-6 | US Liver |
| 29252-4 | CT Chest WO contrast |
| 30578-9 | CT Guidance for drainage of abscess and placement of drainage catheter of Unspecified body region |
| 30579-7 | CT Guidance for injection of Spine facet joint |
| 30580-5 | CT Guidance for fine needle aspiration of Unspecified body region |
| 30581-3 | CT Guidance for radiation treatment of Unspecified body region-- W contrast IV |
| 30582-1 | CT Guidance for radiation treatment of Unspecified body region-- WO contrast |
| 30583-9 | CT Internal auditory canal W contrast IV |
| 30584-7 | CT Internal auditory canal WO contrast |
| 30585-4 | CT Nasopharynx and Neck WO contrast |
| 30586-2 | CT Neck WO and W contrast IV |
| 30587-0 | CT Orbit - bilateral WO contrast |
| 30588-8 | CT Sinuses |
| 30589-6 | CT Petrous part of temporal bone WO contrast |
| 30590-4 | CT Pituitary and Sella turcica W contrast IV |
| 30591-2 | CT Pituitary and Sella turcica WO contrast |
| 30592-0 | CT Cervical spine WO contrast |
| 30593-8 | CTA Head vessels WO and W contrast IV |
| 30594-6 | CTA Neck vessels WO and W contrast IV |
| 30595-3 | CT Guidance for fine needle aspiration of Lung |
| 30596-1 | CT Thoracic spine W contrast IT |
| 30597-9 | CT Thoracic spine WO contrast |
| 30598-7 | CT Chest WO and W contrast IV |
| 30600-1 | CT Small bowel W positive contrast via enteroclysis tube |
| 30601-9 | CT Guidance for biopsy of Abdomen |
| 30602-7 | CT Guidance for fine needle aspiration of Abdomen |
| 30603-5 | CT Guidance for fine needle aspiration of Liver |
| 30604-3 | CT Guidance for biopsy of Pancreas |
| 30605-0 | CT Guidance for fine needle aspiration of Pancreas |
| 30606-8 | CT Guidance for fine needle aspiration of Pelvis |
| 30607-6 | CT Guidance for biopsy of Kidney - bilateral |
| 30608-4 | CT Guidance for fine needle aspiration of Kidney - bilateral |
| 30609-2 | CT Guidance for biopsy of Spleen |
| 30610-0 | CT Guidance for fine needle aspiration of Spleen |
| 30611-8 | CT Liver WO contrast |
| 30612-6 | CT Liver WO and W contrast IV |
| 30613-4 | CT Pancreas WO contrast |
| 30614-2 | CT Pancreas WO and W contrast IV |
| 30615-9 | CT Pelvis WO contrast |
| 30616-7 | CT Pelvis WO and W contrast IV |
| 30619-1 | CT Sacroiliac Joint |
| 30620-9 | CT Lumbar spine WO contrast |
| 30621-7 | CT Spleen WO contrast |
| 30622-5 | CT Spleen W contrast IV |
| 30623-3 | CTA Pelvis vessels WO and W contrast IV |
| 30624-1 | CT Lower extremity W contrast IV |
| 30625-8 | CT Lower extremity WO contrast |
| 30626-6 | CT Upper extremity W contrast IV |
| 30627-4 | CT Upper extremity WO contrast |
| 30628-2 | RF Guidance for removal of foreign body of Unspecified body region |
| 30629-0 | RF Guidance for procedure of Unspecified body region |
| 30630-8 | RF videography Cerebral cisterns Views W contrast |
| 30631-6 | RF Chest Views |
| 30632-4 | RF Diaphragm for motion |
| 30633-2 | RF Esophagus Views W barium contrast PO |
| 30634-0 | RF Guidance for biopsy of Lung |
| 30636-5 | RF Colon Views for reduction W contrast PR |
| 30637-3 | RF Guidance for placement of tube in Gastrointestinal tract |
| 30638-1 | RF Guidance for injection of Hip |
| 30639-9 | RFA Vessel Single view W contrast |
| 30640-7 | RFA Guidance for angioplasty of Vein-- W contrast IV |
| 30641-5 | RFA Guidance for Additional angioplasty of Vein-- W contrast IV |
| 30642-3 | RF Unspecified body region Single view |
| 30643-1 | US Guidance for placement of CV catheter in Vein |
| 30644-9 | US Guidance for placement of tunneled CV catheter |
| 30645-6 | RFA Superior vena cava Views W contrast IV |
| 30646-4 | RF Guidance for change of tube in Sinus tract-- W contrast |
| 30647-2 | RF Biliary ducts and Gallbladder Views W contrast via T-tube |
| 30648-0 | RFA Peripheral artery Views for angioplasty W contrast IA |
| 30649-8 | RFA Guidance for Additional angioplasty of Peripheral artery-- W contrast IA |
| 30650-6 | RF Unspecified body region Views for shunt |
| 30651-4 | US Guidance for percutaneous biopsy.core needle of Breast |
| 30652-2 | US Guidance for fine needle biopsy of Breast |
| 30653-0 | US Guidance for aspiration of cyst of Breast |
| 30654-8 | MR Brachial plexus WO contrast |
| 30655-5 | MR Cerebral cisterns |
| 30656-3 | MR Guidance for stereotactic localization of Brain-- W contrast IV |
| 30657-1 | MR Brain WO contrast |
| 30658-9 | MR Internal auditory canal WO contrast |
| 30659-7 | MR Internal auditory canal WO and W contrast IV |
| 30660-5 | MR Neck WO contrast |
| 30661-3 | MR Orbit - bilateral WO contrast |
| 30662-1 | MR Sinuses WO contrast |
| 30663-9 | MR Sinuses WO and W contrast IV |
| 30664-7 | MR Guidance for radiation treatment of Unspecified body region-- W contrast IV |
| 30665-4 | MR Guidance for radiation treatment of Unspecified body region-- WO contrast |
| 30666-2 | MR Pituitary and Sella turcica WO contrast |
| 30667-0 | MR Cervical spine WO contrast |
| 30668-8 | MR Abdomen WO contrast |
| 30669-6 | MR Liver WO contrast |
| 30670-4 | MR Liver WO and W contrast IV |
| 30671-2 | MR Pelvis and Hip WO contrast |
| 30672-0 | MR Pelvis and Hip WO and W contrast IV |
| 30673-8 | MR Pelvis WO contrast |
| 30674-6 | MR Pelvis WO and W contrast IV |
| 30675-3 | MR Prostate |
| 30678-7 | MR Lumbar spine W contrast IV |
| 30679-5 | MR Lumbar spine WO contrast |
| 30680-3 | MR Ankle WO contrast |
| 30681-1 | MR Foot WO contrast |
| 30682-9 | MR Foot WO and W contrast IV |
| 30683-7 | MR Forearm WO contrast |
| 30684-5 | MR Forearm WO and W contrast IV |
| 30685-2 | MR Hand WO contrast |
| 30686-0 | MR Hand WO and W contrast IV |
| 30687-8 | MR Hip WO contrast |
| 30688-6 | MR Hip WO and W contrast IV |
| 30689-4 | MR Upper arm WO contrast |
| 30690-2 | MR Upper arm WO and W contrast IV |
| 30691-0 | MR Knee WO contrast |
| 30692-8 | MR Lower extremity |
| 30693-6 | MR Shoulder WO contrast |
| 30694-4 | NM Thyroid gland and uptake single view |
| 30695-1 | NM Thyroid gland Views |
| 30696-9 | NM Scrotum and testicle Views |
| 30697-7 | NM Pulmonary system Ventilation and Perfusion |
| 30698-5 | US Guidance for aspiration of cyst of Unspecified body region |
| 30699-3 | US Guidance for drainage and placement of drainage catheter of Unspecified body region |
| 30701-7 | US Unspecified body region during surgery |
| 30702-5 | US Guidance for injection of Thyroid gland |
| 30703-3 | US Guidance for fluid aspiration of Pericardial space |
| 30704-1 | US Abdomen limited |
| 30705-8 | US Uterus and Fallopian tubes |
| 30706-6 | US Liver during surgery |
| 30709-0 | US Lower extremity |
| 30710-8 | US Upper extremity |
| 30711-6 | US Hip developmental joint assessment |
| 30712-4 | US Hip WO developmental joint assessment |
| 30713-2 | XR Spine Views W right bending and W left bending |
| 30714-0 | XR Thoracic and lumbar spine AP for scoliosis |
| 30715-7 | XR Thoracic and lumbar spine AP and lateral for scoliosis |
| 30716-5 | XR Thoracic and lumbar spine Lateral Views for scoliosis |
| 30717-3 | XR Thoracic and lumbar spine Views for scoliosis W standing |
| 30719-9 | XR tomography Temporomandibular joint |
| 30720-7 | XR Orbit - bilateral Views for foreign body |
| 30721-5 | XR Sinuses PA and Lateral |
| 30722-3 | Portable XR Skull Single view |
| 30723-1 | Portable XR Skull Views |
| 30724-9 | Portable XR Cervical spine Single view |
| 30725-6 | XR Cervical spine AP |
| 30726-4 | Portable XR Cervical spine AP and Lateral |
| 30727-2 | Portable XR Cervical spine AP |
| 30729-8 | Portable XR Spine Cervical Odontoid and Cervical axis AP |
| 30730-6 | Portable XR Zygomatic arch - bilateral Views |
| 30731-4 | Portable XR Zygomatic arch Views |
| 30733-0 | Portable XR Chest Right oblique and Left oblique |
| 30734-8 | XR Chest AP lateral-decubitus |
| 30735-5 | Portable XR Chest AP lateral-decubitus |
| 30736-3 | XR Chest Views W inspiration and expiration |
| 30737-1 | XR Chest Left lateral |
| 30738-9 | Portable XR Chest Left lateral |
| 30739-7 | Portable XR Chest Oblique |
| 30740-5 | XR Chest Oblique |
| 30741-3 | XR Chest PA and Lateral and Lordotic upright |
| 30742-1 | XR Chest PA and Lateral and Right oblique and Left oblique |
| 30743-9 | Portable XR Chest PA and Lateral and Right oblique and Left oblique |
| 30744-7 | XR Chest PA and Lateral and Oblique |
| 30745-4 | XR Chest Views |
| 30746-2 | Portable XR Chest Views |
| 30747-0 | Portable XR Ribs Views |
| 30748-8 | XR Shoulder Single view |
| 30749-6 | Portable XR Shoulder Single view |
| 30750-4 | XR Shoulder 5 Views |
| 30751-2 | XR Shoulder West Point |
| 30752-0 | XR Thoracic spine AP |
| 30753-8 | XR Thoracic spine AP and Lateral |
| 30754-6 | Portable XR Thoracic spine AP and Lateral |
| 30755-3 | Portable XR Thoracic spine AP |
| 30756-1 | XR Thoracic spine Lateral |
| 30757-9 | Portable XR Thoracic spine Lateral |
| 30758-7 | XR Thoracic spine Oblique |
| 30759-5 | Portable XR Thoracic spine Oblique |
| 30760-3 | XR tomography Kidney - bilateral 3 views W contrast IV |
| 30762-9 | XR tomography Abdomen |
| 30763-7 | Portable XR Abdomen AP and Lateral crosstable |
| 30764-5 | Portable XR Acetabulum - bilateral Views |
| 30765-2 | Portable XR Acetabulum Views |
| 30766-0 | XR Pelvis 3 Views |
| 30767-8 | XR Pelvis and Hip Views |
| 30768-6 | XR Pelvis and Hip - bilateral Views |
| 30769-4 | XR Pelvis and Hip - bilateral Maximum abduction Views |
| 30770-2 | XR Pelvis and Hip AP and Lateral frog |
| 30771-0 | XR Pelvis Inlet and Outlet |
| 30772-8 | Portable XR Pelvis Views |
| 30773-6 | XR Lumbar spine Single view |
| 30774-4 | Portable XR Lumbar spine Single view |
| 30775-1 | XR Lumbar spine 3 Views |
| 30776-9 | Portable XR Lumbar spine 3 Views |
| 30777-7 | XR Lumbar spine AP |
| 30778-5 | XR Lumbar spine Oblique |
| 30779-3 | XR Ankle AP and Lateral |
| 30780-1 | XR Finger second Views |
| 30781-9 | XR Finger third Views |
| 30782-7 | XR Finger fourth Views |
| 30783-5 | XR Finger fifth Views |
| 30784-3 | XR Foot 2 Views |
| 30785-0 | XR Foot Views W forced dorsiflexion |
| 30786-8 | XR Hip Lateral frog |
| 30787-6 | XR Joint Single view |
| 30788-4 | XR Knee 3 Views |
| 30789-2 | XR Knee 4 Views |
| 30790-0 | XR Knee Tunnel |
| 30791-8 | XR Patella Views |
| 30792-6 | Portable XR Patella Views |
| 30793-4 | XR Wrist AP and Lateral |
| 30794-2 | MR Breast |
| 30795-9 | MR Breast - bilateral |
| 30796-7 | MR Elbow WO contrast |
| 30797-5 | XR Lumbar spine 5 Views |
| 30799-1 | CT Head WO contrast |
| 30800-7 | MR Guidance for stereotactic localization of Brain-- WO contrast |
| 30801-5 | CT Maxillofacial region W contrast IV |
| 30802-3 | CT Maxillofacial region WO contrast |
| 30803-1 | CT Maxillofacial region WO and W contrast IV |
| 30804-9 | CTA Chest vessels WO and W contrast IV |
| 30805-6 | CTA Abdominal vessels WO and W contrast IV |
| 30807-2 | CTA Lower extremity vessels WO and W contrast IV |
| 30808-0 | RF Cervical and thoracic and lumbar spine Views W contrast IT |
| 30809-8 | RF Upper gastrointestinal tract and Small bowel Single view W contrast PO |
| 30810-6 | RF Lacrimal duct Views W contrast intra lacrimal duct |
| 30811-4 | RF Posterior fossa Views W contrast IT |
| 30812-2 | RF Guidance for injection of Spine Cervical Facet Joint |
| 30813-0 | XR Lung - bilateral Views W contrast intrabronchial |
| 30814-8 | RF Guidance for injection of Spine Thoracic Facet Joint |
| 30815-5 | RF Guidance for endoscopy of Biliary ducts and Pancreatic duct-- W contrast retrograde |
| 30816-3 | RFA Peritoneum Views W contrast percutaneous intraperitoneal |
| 30817-1 | RF Guidance for injection of Lumbar Spine Facet Joint |
| 30818-9 | RF Guidance for placement of catheter in Fallopian tubes-- transcervical |
| 30819-7 | RFA Epidural veins Views W contrast IV |
| 30820-5 | RFA Carotid artery.external - bilateral Views W contrast IA |
| 30821-3 | RFA Carotid artery.external Views W contrast IA |
| 30822-1 | RFA Head artery - bilateral and Neck artery - bilateral Views W contrast IA |
| 30823-9 | RFA Head artery and Neck artery Views W contrast IA |
| 30824-7 | RFA Intercranial vessel and Neck Vessel Views W contrast |
| 30825-4 | RFA Orbit veins Views W contrast IV |
| 30828-8 | RFA Brachial artery Views W contrast IA |
| 30829-6 | RFA Internal thoracic artery Views W contrast IA |
| 30830-4 | RFA Pulmonary artery - bilateral Views W contrast IA |
| 30831-2 | RFA Adrenal artery - bilateral Views W contrast IA |
| 30832-0 | RFA Adrenal artery Views W contrast IA |
| 30833-8 | RFA Pelvis arteries Views W contrast IA |
| 30834-6 | RFA Renal artery - bilateral Views W contrast IA |
| 30836-1 | RFA Guidance for angioplasty of Visceral artery-- W contrast IA |
| 30837-9 | RFA Abdominal Aorta Views W contrast IA |
| 30838-7 | RFA Aorta and Femoral artery - bilateral Runoff W contrast IA |
| 30839-5 | RFA Abdominal lymphatic vessels Views W contrast intra lymphatic |
| 30840-3 | RFA Abdominal lymphatic vessels - bilateral Views W contrast intra lymphatic |
| 30841-1 | RFA Portal vein Views W contrast transhepatic |
| 30842-9 | RFA Portal vein Views for hemodynamics W contrast transhepatic |
| 30843-7 | RFA Adrenal vein Views W contrast IV |
| 30844-5 | RFA Adrenal vein - bilateral Views W contrast IV |
| 30845-2 | RFA Inferior vena cava Views W contrast IV |
| 30846-0 | RFA Renal vein - bilateral Views W contrast IV |
| 30847-8 | RFA Renal vein Views W contrast IV |
| 30848-6 | RFA Extremity arteries Views W contrast IA |
| 30849-4 | RFA Extremity arteries - bilateral Views W contrast IA |
| 30850-2 | RFA Extremity lymphatic vessels Views W contrast intra lymphatic |
| 30851-0 | RFA Extremity lymphatic vessels - bilateral Views W contrast intra lymphatic |
| 30852-8 | RFA XXX>Peripheral veins - bilateral Views W contrast IV |
| 30853-6 | US Breast duct W contrast intra duct |
| 30854-4 | MR Cervical and thoracic and lumbar spine WO contrast |
| 30855-1 | MR Cervical and thoracic and lumbar spine WO and W contrast IV |
| 30856-9 | MRA Head vessels |
| 30857-7 | MR Nerves cranial |
| 30858-5 | MRA Head veins |
| 30859-3 | MRA Carotid vessels and Neck vessels |
| 30860-1 | MR Nasopharynx |
| 30861-9 | MRA Aortic arch and Neck vessels |
| 30862-7 | MRA Chest vessels |
| 30864-3 | MRA Abdominal veins and IVC |
| 30865-0 | MRA Celiac vessels and Superior mesenteric Vessels |
| 30866-8 | MR Lumbosacral plexus |
| 30867-6 | MRA Pelvis vessels |
| 30868-4 | MRA Renal vessels |
| 30869-2 | MR Lower leg WO contrast |
| 30870-0 | MR Lower leg WO and W contrast IV |
| 30871-8 | MRA Femoral vessels |
| 30872-6 | MRA Foot vessels |
| 30873-4 | MRA Forearm vessels |
| 30874-2 | MRA Lower extremity vessels |
| 30875-9 | MR Upper extremity.joint |
| 30876-7 | MRA Extremity veins |
| 30877-5 | NM Kidney+Renal vessels Views |
| 30878-3 | US Guidance for fluid aspiration of Unspecified body region |
| 30880-9 | US.doppler Head vessels and Neck vessels |
| 30881-7 | US.doppler Lower extremity vein |
| 30882-5 | US.doppler Upper extremity vein |
| 30883-3 | XR Coccyx Views |
| 30884-1 | XR Sacrum Views |
| 30885-8 | XR Pelvis symphysis pubis Views |
| 30887-4 | MRA Renal vessels W contrast IV |
| 30888-2 | MRA Tibioperoneal vessels |
| 30889-0 | XR Temporomandibular joint - left Views |
| 30890-8 | XR Temporomandibular joint - right Views |
| 30892-4 | RF Guidance for placement of catheter in Biliary ducts and Pancreatic duct-- W contrast retrograde |
| 35881-2 | RFA Guidance for angioplasty of Extremity artery-- W contrast IA |
| 35882-0 | RFA Guidance for angioplasty of Inferior vena cava-- W contrast IV |
| 35883-8 | RFA Guidance for atherectomy of Thoracic and abdominal aorta-- W contrast IA |
| 35884-6 | CT Guidance for drainage of abscess and placement of drainage catheter of Abdomen |
| 35885-3 | RF Guidance for drainage of abscess and placement of drainage catheter of Unspecified body region |
| 35886-1 | CT Guidance for fluid aspiration of Breast |
| 35887-9 | CT Guidance for aspiration of cyst of Unspecified body region |
| 35888-7 | RF Guidance for arthrocentesis of Hip |
| 35889-5 | RF Guidance for bronchoscopy of Chest |
| 35890-3 | RF Guidance for biopsy of Abdomen |
| 35891-1 | CT guidance for percutaneous biopsy of Bone |
| 35892-9 | CT Guidance for biopsy of Head |
| 35893-7 | CT Guidance for biopsy of Breast |
| 35894-5 | RF Guidance for biopsy of Chest |
| 35895-2 | CT Guidance for biopsy of Chest |
| 35896-0 | CT Guidance for biopsy of Lower extremity |
| 35897-8 | CT Guidance for biopsy of Upper extremity |
| 35898-6 | CT Guidance for biopsy of Salivary gland |
| 35899-4 | RF Guidance for biopsy of Kidney |
| 35900-0 | RF Guidance for percutaneous biopsy of Liver |
| 35901-8 | CT Guidance for biopsy of Lymph node |
| 35902-6 | RF Guidance for biopsy of Pancreas |
| 35903-4 | CT Guidance for biopsy of Prostate |
| 35904-2 | CT Guidance for biopsy of Cervical spine |
| 35905-9 | CT Guidance for biopsy of Lumbar spine |
| 35906-7 | CT Guidance for biopsy of Thoracic spine |
| 35907-5 | RF Guidance for biopsy of Spleen |
| 35908-3 | CT Guidance for biopsy of Thyroid gland |
| 35909-1 | CT Guidance for biopsy of Chest-- W contrast IV |
| 35910-9 | CT Guidance for biopsy of Chest-- WO and W contrast IV |
| 35911-7 | CT Guidance for biopsy of Chest-- WO contrast |
| 35912-5 | RF Guidance for placement of catheter in Unspecified body region |
| 35913-3 | CT Guidance for drainage and placement of drainage catheter of Abdomen |
| 35914-1 | CT Guidance for drainage and placement of drainage catheter of Anus |
| 35915-8 | CT Guidance for drainage and placement of drainage catheter of Appendix |
| 35916-6 | CT Guidance for drainage and placement of drainage catheter of Chest |
| 35917-4 | CT Guidance for drainage and placement of drainage catheter of Gallbladder |
| 35918-2 | CT Guidance for drainage and placement of drainage catheter of Kidney |
| 35919-0 | CT Guidance for drainage and placement of drainage catheter of Liver |
| 35920-8 | CT Guidance for drainage of Lymph node |
| 35921-6 | CT Guidance for drainage and placement of drainage catheter of Pelvis |
| 35922-4 | CT Guidance for drainage and placement of drainage catheter of Unspecified body region |
| 35923-2 | CT Guidance for drainage and placement of drainage catheter of Chest-- W contrast IV |
| 35924-0 | CT Guidance for drainage and placement of drainage catheter of Chest-- WO contrast |
| 35925-7 | RF Guidance for endoscopy of Stomach |
| 35926-5 | RF Guidance for gastrostomy of Stomach |
| 35927-3 | RF Guidance for injection of Sacroiliac Joint |
| 35928-1 | CT Guidance for localization of Breast - left |
| 35929-9 | CT Guidance for localization of Breast - right |
| 35930-7 | CT Guidance for nerve block of Abdomen |
| 35931-5 | CT Guidance for nerve block of Pelvis |
| 35932-3 | CT Guidance for nerve block of Lumbar spine |
| 35933-1 | CT Guidance for percutaneous vertebroplasty of Spine |
| 35934-9 | CT Guidance for percutaneous vertebroplasty of Lumbar spine |
| 35935-6 | CT Guidance for percutaneous vertebroplasty of Thoracic spine |
| 35936-4 | RF Guidance for percutaneous vertebroplasty of Spine |
| 35937-2 | CT Guidance for placement of radiation therapy fields in Unspecified body region |
| 35938-0 | CT Guidance for placement of tube in Chest |
| 35939-8 | XR tomography Ankle |
| 35940-6 | CT Ankle |
| 35941-4 | CT Ankle - bilateral |
| 35942-2 | CT Ankle - left |
| 35943-0 | XR tomography Ankle - left |
| 35944-8 | CT Ankle - right |
| 35945-5 | CT Thoracic and abdominal aorta |
| 35946-3 | MRA Thoracic and abdominal aorta |
| 35947-1 | MR Thoracic and abdominal aorta |
| 35948-9 | CT Abdominal Aorta |
| 35949-7 | MR Abdominal Aorta |
| 35950-5 | MR Thoracic Aorta |
| 35951-3 | MRA Aortic arch |
| 35952-1 | CT Appendix |
| 35953-9 | MR Face |
| 35954-7 | MR Breast - left |
| 35955-4 | MR Breast - right |
| 35956-2 | MR Internal auditory canal |
| 35957-0 | CT Internal auditory canal - left |
| 35958-8 | CT Internal auditory canal |
| 35959-6 | XR tomography Clavicle |
| 35960-4 | CT Clavicle |
| 35961-2 | MR Clavicle |
| 35962-0 | CT Elbow |
| 35963-8 | XR tomography Elbow |
| 35964-6 | XR tomography Elbow - bilateral |
| 35965-3 | CT Elbow - bilateral |
| 35966-1 | CT Elbow - left |
| 35967-9 | XR tomography Elbow - left |
| 35968-7 | CT Elbow - right |
| 35969-5 | CT Esophagus |
| 35970-3 | XR tomography Extremity |
| 35971-1 | CT Lower extremity |
| 35972-9 | XR tomography Lower extremity |
| 35973-7 | CT Lower extremity - bilateral |
| 35974-5 | MRA Lower extremity vessels - bilateral |
| 35975-2 | MR Lower extremity - bilateral |
| 35976-0 | CT Lower extremity - left |
| 35977-8 | XR tomography Lower extremity - left |
| 35978-6 | MR Lower extremity - left |
| 35979-4 | CT Lower extremity - right |
| 35980-2 | MR Lower extremity - right |
| 35981-0 | CT Upper extremity |
| 35982-8 | CT Upper extremity - left |
| 35983-6 | CT Upper extremity - right |
| 35984-4 | CT Thigh |
| 35985-1 | XR tomography Femur |
| 35986-9 | XR tomography Femur - bilateral |
| 35987-7 | CT Thigh - left |
| 35988-5 | XR tomography Femur - left |
| 35989-3 | CT Thigh - right |
| 35990-1 | MR Fetal |
| 35991-9 | CT Foot |
| 35992-7 | XR tomography Foot |
| 35993-5 | CT Foot - bilateral |
| 35994-3 | CT Foot - left |
| 35995-0 | XR tomography Foot - left |
| 35996-8 | CT Foot - right |
| 35997-6 | CT Forearm |
| 35998-4 | CT Forearm - bilateral |
| 35999-2 | CT Forearm - left |
| 36000-8 | CT Forearm - right |
| 36001-6 | XR tomography Gallbladder |
| 36002-4 | CT Hand |
| 36003-2 | XR tomography Hand |
| 36004-0 | CT Hand - bilateral |
| 36005-7 | CT Hand - left |
| 36006-5 | XR tomography Hand - left |
| 36007-3 | CT Hand - right |
| 36008-1 | MR Wrist and Hand |
| 36009-9 | MRA Heart |
| 89927-8 | CT Heart and aortic root WO contrast for calcium scoring + CTA W contrast IV |
| 36011-5 | XR tomography Calcaneus |
| 36012-3 | XR tomography Hip |
| 36013-1 | MR Hip |
| 36014-9 | CT Hip |
| 36015-6 | XR tomography Hip - bilateral |
| 36016-4 | CT Hip - bilateral |
| 36017-2 | MR Hip - bilateral |
| 36018-0 | CT Hip - left |
| 36019-8 | XR tomography Hip - left |
| 36020-6 | MR Hip - left |
| 36021-4 | CT Hip - right |
| 36022-2 | MR Hip - right |
| 36023-0 | CT Upper arm |
| 36024-8 | XR tomography Humerus |
| 36025-5 | MR Upper arm |
| 36026-3 | CT Upper arm - bilateral |
| 36027-1 | CT Upper arm - left |
| 36028-9 | MR Upper arm - left |
| 36029-7 | CT Upper arm - right |
| 36030-5 | MR Upper arm - right |
| 36031-3 | MR Sacroiliac Joint |
| 36032-1 | XR tomography Kidney |
| 36033-9 | MR Kidney |
| 36034-7 | MR Kidney - bilateral |
| 36035-4 | MR Kidney - left |
| 36036-2 | MR Kidney - right |
| 36037-0 | CT Knee |
| 36038-8 | XR tomography Knee |
| 36039-6 | XR tomography Knee - bilateral |
| 36040-4 | CT Knee - bilateral |
| 36041-2 | CT Knee - left |
| 36042-0 | XR tomography Knee - left |
| 36043-8 | CT Knee - right |
| 36044-6 | XR tomography Larynx |
| 36045-3 | MR Larynx |
| 36046-1 | MR Liver |
| 36047-9 | CT Mandible |
| 36048-7 | XR tomography Mandible |
| 36049-5 | CT Maxilla and Mandible |
| 36050-3 | CT Maxilla |
| 36051-1 | CT Neck |
| 36052-9 | MR Pancreas |
| 36053-7 | MR Parathyroid gland |
| 36054-5 | CT Brachial plexus |
| 36055-2 | CT Posterior fossa |
| 36056-0 | MR Posterior fossa |
| 36057-8 | CT Prostate |
| 36058-6 | CT Sacrum |
| 36059-4 | MR Sacrum |
| 36060-2 | MR Sacrum and Coccyx |
| 36061-0 | MR Scapula |
| 36062-8 | CT Shoulder |
| 36063-6 | CT Shoulder - bilateral |
| 36064-4 | CT Shoulder - left |
| 36065-1 | XR tomography Shoulder - left |
| 36066-9 | CT Shoulder - right |
| 36067-7 | MR Spine |
| 36068-5 | XR tomography Cervical spine |
| 36069-3 | XR tomography Lumbar spine |
| 36070-1 | MR Spleen |
| 36071-9 | CT Sternum |
| 36072-7 | MR Sternum |
| 36073-5 | MR Scrotum and testicle |
| 36074-3 | CT Lower leg |
| 36075-0 | MR Lower leg - left |
| 36076-8 | MR Lower leg - right |
| 36077-6 | MRA Portal vein |
| 36078-4 | MRA Renal vein |
| 36079-2 | MRA Lower extremity veins |
| 36080-0 | MRA Upper extremity veins |
| 36081-8 | MRA Vena cava |
| 36082-6 | MRA Inferior vena cava |
| 36083-4 | MR Inferior vena cava |
| 36084-2 | MRA Upper extremity vessels |
| 36085-9 | MRA Neck vessels |
| 36086-7 | CT Abdomen limited |
| 36087-5 | CT Head limited |
| 36088-3 | MR Internal auditory canal limited |
| 36089-1 | CT Chest limited |
| 36090-9 | CT Extremity limited |
| 36091-7 | MR Heart limited |
| 79087-3 | CT Heart and Coronary arteries for calcium scoring WO contrast |
| 36092-5 | CT Hip limited |
| 36093-3 | MR Lower Extremity Joint limited |
| 36094-1 | MR Upper extremity.joint limited |
| 36095-8 | CT Abdomen limited W contrast IV |
| 36096-6 | MR Brain limited W contrast IV |
| 36097-4 | CT Upper extremity limited W contrast IV |
| 36098-2 | CT Pelvis limited W contrast IV |
| 36099-0 | CT Cervical spine limited W contrast IV |
| 36100-6 | MR Lumbar spine limited W contrast IV |
| 36101-4 | MR Thoracic spine limited W contrast IV |
| 36102-2 | CT Abdomen limited WO and W contrast IV |
| 36103-0 | CT Abdomen limited WO contrast |
| 36104-8 | CT Head limited WO contrast |
| 36105-5 | MR Brain limited WO contrast |
| 36106-3 | CT Lower extremity limited WO contrast |
| 36107-1 | MR Lower extremity joint - left limited WO contrast |
| 36108-9 | CT Pelvis limited WO contrast |
| 36109-7 | CT Cervical spine limited WO contrast |
| 36110-5 | CT Lumbar spine limited WO contrast |
| 36111-3 | MR Lumbar spine limited WO contrast |
| 36112-1 | MR Thoracic spine limited WO contrast |
| 36113-9 | MR Kidney W contrast IV |
| 36114-7 | MR Breast - bilateral dynamic W contrast IV |
| 36115-4 | MR Ankle Arthrogram |
| 36116-2 | MR Ankle - left Arthrogram |
| 36117-0 | MR Ankle - right Arthrogram |
| 36118-8 | MR Elbow - left Arthrogram |
| 36119-6 | MR Elbow - right Arthrogram |
| 36120-4 | MR Hip Arthrogram |
| 36121-2 | MR Hip - left Arthrogram |
| 36122-0 | MR Hip - right Arthrogram |
| 36123-8 | CT Sacroiliac Joint Arthrogram |
| 36124-6 | CT Knee Arthrogram |
| 36125-3 | MR Knee Arthrogram |
| 36126-1 | MR Knee - left Arthrogram |
| 36127-9 | MR Knee - right Arthrogram |
| 36128-7 | CT Shoulder Arthrogram |
| 36129-5 | MR Shoulder Arthrogram |
| 36130-3 | MR Shoulder - left Arthrogram |
| 36131-1 | CT Shoulder - right Arthrogram |
| 36132-9 | MR Shoulder - right Arthrogram |
| 36134-5 | MR Abdomen W contrast IV |
| 36135-2 | CT Ankle W contrast IV |
| 36136-0 | MR Ankle W contrast IV |
| 36137-8 | CT Ankle - left W contrast IV |
| 36138-6 | MR Ankle - left W contrast IV |
| 36139-4 | CT Ankle - right W contrast IV |
| 36140-2 | MR Ankle - right W contrast IV |
| 36141-0 | CTA Thoracic and abdominal aorta W contrast IV |
| 36142-8 | CT Thoracic and abdominal aorta W contrast IV |
| 36143-6 | CT Abdominal Aorta W contrast IV |
| 36144-4 | CTA Aortic arch W contrast IV |
| 36145-1 | CT Appendix W contrast IV |
| 36146-9 | CTA Carotid artery W contrast IV |
| 36147-7 | CTA Pulmonary arteries W contrast IV |
| 36148-5 | MR Face W contrast IV |
| 36149-3 | MR Breast W contrast IV |
| 36150-1 | MR Breast - bilateral W contrast IV |
| 36151-9 | MR Breast - left W contrast IV |
| 36152-7 | MR Breast - right W contrast IV |
| 36155-0 | MR Internal auditory canal W contrast IV |
| 36156-8 | MR Chest W contrast IV |
| 36157-6 | CT Elbow W contrast IV |
| 36158-4 | MR Elbow W contrast IV |
| 36159-2 | CT Elbow - left W contrast IV |
| 36160-0 | MR Elbow - left W contrast IV |
| 36161-8 | CT Elbow - right W contrast IV |
| 36162-6 | MR Elbow - right W contrast IV |
| 36163-4 | MR Lower extremity - bilateral W contrast IV |
| 36164-2 | CT Lower extremity - left W contrast IV |
| 36165-9 | MR Lower extremity - left W contrast IV |
| 36166-7 | CT Lower extremity - right W contrast IV |
| 36167-5 | MR Lower extremity - right W contrast IV |
| 36168-3 | CT Upper extremity - bilateral W contrast IV |
| 36169-1 | CT Upper extremity - left W contrast IV |
| 36170-9 | CT Upper extremity - right W contrast IV |
| 36171-7 | MR Upper extremity - right W contrast IV |
| 36172-5 | CT Thigh W contrast IV |
| 36173-3 | MR Thigh W contrast IV |
| 36174-1 | CT Thigh - left W contrast IV |
| 36175-8 | MR Thigh - left W contrast IV |
| 36176-6 | CT Thigh - right W contrast IV |
| 36177-4 | MR Thigh - right W contrast IV |
| 36178-2 | CT Foot W contrast IV |
| 36179-0 | MR Foot W contrast IV |
| 36180-8 | MR Foot - bilateral W contrast IV |
| 36181-6 | CT Foot - left W contrast IV |
| 36182-4 | MR Foot - left W contrast IV |
| 36183-2 | CT Foot - right W contrast IV |
| 36184-0 | MR Foot - right W contrast IV |
| 36185-7 | CT Forearm W contrast IV |
| 36186-5 | MR Forearm W contrast IV |
| 36187-3 | CT Forearm - left W contrast IV |
| 36188-1 | MR Forearm - left W contrast IV |
| 36189-9 | CT Forearm - right W contrast IV |
| 36190-7 | MR Forearm - right W contrast IV |
| 36191-5 | CT Hand W contrast IV |
| 36192-3 | MR Hand W contrast IV |
| 36193-1 | CT Hand - left W contrast IV |
| 36194-9 | MR Hand - left W contrast IV |
| 36195-6 | CT Hand - right W contrast IV |
| 36196-4 | MR Hand - right W contrast IV |
| 36197-2 | MR Heart W contrast IV |
| 36934-8 | CT Heart for calcium scoring |
| 36199-8 | MR Hip W contrast IV |
| 36200-4 | CT Hip W contrast IV |
| 36201-2 | CT Hip - bilateral W contrast IV |
| 36202-0 | MR Hip - bilateral W contrast IV |
| 36203-8 | CT Hip - left W contrast IV |
| 36204-6 | MR Hip - left W contrast IV |
| 36205-3 | CT Hip - right W contrast IV |
| 36206-1 | MR Hip - right W contrast IV |
| 36207-9 | CT Upper arm W contrast IV |
| 36208-7 | MR Upper arm W contrast IV |
| 36209-5 | CT Upper arm - left W contrast IV |
| 36210-3 | MR Upper arm - left W contrast IV |
| 36211-1 | CT Upper arm - right W contrast IV |
| 36212-9 | MR Upper arm - right W contrast IV |
| 36213-7 | MR Lower Extremity Joint W contrast IV |
| 36214-5 | MR Lower extremity joint - left W contrast IV |
| 36215-2 | MR Lower extremity joint - right W contrast IV |
| 36216-0 | MR Upper extremity.joint W contrast IV |
| 36217-8 | CT Sacroiliac Joint W contrast IV |
| 36218-6 | MR Sacroiliac Joint W contrast IV |
| 36219-4 | MR Kidney - bilateral W contrast IV |
| 36220-2 | MR Kidney - left W contrast IV |
| 36221-0 | MR Kidney - right W contrast IV |
| 36222-8 | CT Knee W contrast IV |
| 36223-6 | MR Knee W contrast IV |
| 36224-4 | MR Knee - bilateral W contrast IV |
| 36225-1 | CT Knee - left W contrast IV |
| 36226-9 | MR Knee - left W contrast IV |
| 36227-7 | CT Knee - right W contrast IV |
| 36228-5 | MR Knee - right W contrast IV |
| 36229-3 | CT Larynx W contrast IV |
| 36230-1 | MR Larynx W contrast IV |
| 36231-9 | MR Liver W contrast IV |
| 36232-7 | CT Mandible W contrast IV |
| 36233-5 | MR Nasopharynx W contrast IV |
| 36234-3 | CTA Neck vessels W contrast IV |
| 36235-0 | CT Neck W contrast IV |
| 36236-8 | MR Pancreas W contrast IV |
| 36237-6 | MR Pelvis W contrast IV |
| 36238-4 | MR Pituitary and Sella turcica W contrast IV |
| 36239-2 | MR Brachial plexus W contrast IV |
| 36240-0 | MR Brachial plexus - left W contrast IV |
| 36241-8 | MR Brachial plexus - right W contrast IV |
| 36242-6 | CT Posterior fossa W contrast IV |
| 36243-4 | MR Posterior fossa W contrast IV |
| 36244-2 | MR Prostate W contrast IV |
| 36245-9 | CT Sacrum W contrast IV |
| 36246-7 | MR Sacrum W contrast IV |
| 36247-5 | MR Sacrum and Coccyx W contrast IV |
| 36248-3 | MR Scapula - left W contrast IV |
| 36249-1 | MR Scapula - right W contrast IV |
| 36250-9 | CT Shoulder W contrast IV |
| 36251-7 | MR Shoulder W contrast IV |
| 36252-5 | CT Shoulder - left W contrast IV |
| 36253-3 | CT Shoulder - right W contrast IV |
| 36254-1 | MR Shoulder - right W contrast IV |
| 36255-8 | CT Sinuses W contrast IV |
| 36256-6 | MR Spine W contrast IV |
| 36257-4 | CT Sternum W contrast IV |
| 36258-2 | CT Lower leg W contrast IV |
| 36259-0 | MR Lower leg W contrast IV |
| 36260-8 | CT Lower leg - left W contrast IV |
| 36261-6 | MR Lower leg - left W contrast IV |
| 36262-4 | CT Lower leg - right W contrast IV |
| 36263-2 | MR Lower leg - right W contrast IV |
| 36264-0 | CT Uterus W contrast IV |
| 36265-7 | MR Uterus W contrast IV |
| 36266-5 | CTA Chest vessels W contrast IV |
| 36267-3 | CT Abdomen WO and W contrast IV |
| 36268-1 | CT Ankle WO and W contrast IV |
| 36269-9 | CT Ankle - left WO and W contrast IV |
| 36270-7 | CT Ankle - right WO and W contrast IV |
| 36271-5 | CT Abdominal Aorta WO and W contrast IV |
| 36272-3 | MRA Abdominal Aorta WO and W contrast IV |
| 36273-1 | MR Abdominal Aorta WO and W contrast IV |
| 36274-9 | MRA Thoracic Aorta WO and W contrast IV |
| 36275-6 | MRA Renal artery WO and W contrast IV |
| 36276-4 | MR Breast WO and W contrast IV |
| 36277-2 | MR Breast - bilateral WO and W contrast IV |
| 36278-0 | MR Breast - left WO and W contrast IV |
| 36279-8 | MR Breast - right WO and W contrast IV |
| 36282-2 | CT Internal auditory canal WO and W contrast IV |
| 36283-0 | MR Chest WO and W contrast IV |
| 36284-8 | MR Chest and Abdomen WO and W contrast IV |
| 36285-5 | CT Elbow WO and W contrast IV |
| 36286-3 | CT Elbow - left WO and W contrast IV |
| 36287-1 | CT Elbow - right WO and W contrast IV |
| 36288-9 | CT Lower extremity WO and W contrast IV |
| 36289-7 | MR Lower extremity - bilateral WO and W contrast IV |
| 36290-5 | CT Lower extremity - left WO and W contrast IV |
| 36291-3 | MR Lower extremity - left WO and W contrast IV |
| 36292-1 | CT Lower extremity - right WO and W contrast IV |
| 36293-9 | XR Abdomen 3 Views |
| 36294-7 | XR Ankle 3 Views |
| 36295-4 | XR Ankle - bilateral 3 Views |
| 36296-2 | XR Ankle - left 3 Views |
| 36297-0 | XR Facial bones 3 Views |
| 36298-8 | XR Chest 3 Views |
| 36299-6 | XR Elbow 3 Views |
| 36300-2 | XR Elbow - bilateral 3 Views |
| 36301-0 | XR Elbow - left 3 Views |
| 36302-8 | XR Femur 3 Views |
| 36303-6 | XR Finger 3 Views |
| 36304-4 | XR Finger - left 3 Views |
| 36305-1 | XR Foot 3 Views |
| 36306-9 | XR Foot - bilateral 3 Views |
| 36307-7 | XR Foot - left 3 Views |
| 36308-5 | XR Hip - bilateral 3 Views |
| 36309-3 | XR Hip - left 3 Views |
| 36310-1 | XR Knee - bilateral 3 Views |
| 36311-9 | XR Knee - left 3 Views |
| 36312-7 | XR Mandible 3 Views |
| 36313-5 | XR Ribs - bilateral 3 Views |
| 36314-3 | XR Ribs - left 3 Views |
| 36315-0 | XR Thumb - left 3 Views |
| 36316-8 | XR Toes - left 3 Views |
| 36317-6 | XR Ankle 4 Views |
| 36318-4 | XR Facial bones 4 Views |
| 36319-2 | MG Breast 4 Views |
| 36320-0 | XR Chest 4 Views |
| 36321-8 | XR and RF Chest 4 Views and Views |
| 36322-6 | XR Elbow - bilateral 4 Views |
| 36323-4 | XR Elbow - left 4 Views |
| 36324-2 | XR Femur - left 4 Views |
| 36325-9 | XR Knee - bilateral 4 Views |
| 36326-7 | XR Knee - left 4 Views |
| 36327-5 | XR Mandible 4 Views |
| 36328-3 | XR Ribs - bilateral 4 Views |
| 36329-1 | XR Shoulder - bilateral 4 Views |
| 36330-9 | XR Shoulder - left 4 Views |
| 36331-7 | XR Cervical spine 4 Views |
| 36332-5 | XR Lumbar spine 4 Views |
| 36333-3 | MR Lower extremity - right WO and W contrast IV |
| 36334-1 | CT Upper extremity WO and W contrast IV |
| 36335-8 | CT Upper extremity - left WO and W contrast IV |
| 36336-6 | CT Upper extremity - right WO and W contrast IV |
| 36337-4 | MR Upper extremity - right WO and W contrast IV |
| 36338-2 | CT Thigh WO and W contrast IV |
| 36339-0 | CT Thigh - left WO and W contrast IV |
| 36340-8 | CT Thigh - right WO and W contrast IV |
| 36341-6 | CT Foot WO and W contrast IV |
| 36342-4 | MR Foot - bilateral WO and W contrast IV |
| 36343-2 | CT Foot - left WO and W contrast IV |
| 36344-0 | MR Foot - left WO and W contrast IV |
| 36345-7 | CT Foot - right WO and W contrast IV |
| 36346-5 | MR Foot - right WO and W contrast IV |
| 36347-3 | CT Forearm WO and W contrast IV |
| 36348-1 | CT Forearm - left WO and W contrast IV |
| 36349-9 | MR Forearm - left WO and W contrast IV |
| 36350-7 | CT Forearm - right WO and W contrast IV |
| 36351-5 | MR Forearm - right WO and W contrast IV |
| 36352-3 | CT Hand WO and W contrast IV |
| 36353-1 | CT Hand - left WO and W contrast IV |
| 36354-9 | MR Hand - left WO and W contrast IV |
| 36355-6 | CT Hand - right WO and W contrast IV |
| 36356-4 | MR Hand - right WO and W contrast IV |
| 36357-2 | MR Heart WO and W contrast IV |
| 36935-5 | CT Heart for calcium scoring W contrast IV |
| 36359-8 | CT Hip WO and W contrast IV |
| 36360-6 | CT Hip - bilateral WO and W contrast IV |
| 36361-4 | MR Hip - bilateral WO and W contrast IV |
| 36362-2 | CT Hip - left WO and W contrast IV |
| 36363-0 | MR Hip - left WO and W contrast IV |
| 36364-8 | CT Hip - right WO and W contrast IV |
| 36365-5 | MR Hip - right WO and W contrast IV |
| 36366-3 | CT Upper arm WO and W contrast IV |
| 36367-1 | CT Upper arm - left WO and W contrast IV |
| 36368-9 | MR Upper arm - left WO and W contrast IV |
| 36369-7 | CT Upper arm - right WO and W contrast IV |
| 36370-5 | MR Upper arm - right WO and W contrast IV |
| 36371-3 | MR Lower Extremity Joint WO and W contrast IV |
| 36372-1 | MR Lower extremity joint - left WO and W contrast IV |
| 36373-9 | MR Lower extremity joint - right WO and W contrast IV |
| 36374-7 | MR Upper extremity.joint WO and W contrast IV |
| 36375-4 | CT Sacroiliac Joint WO and W contrast IV |
| 36376-2 | MR Sacroiliac Joint WO and W contrast IV |
| 36377-0 | CT Kidney - bilateral WO and W contrast IV |
| 36378-8 | MR Kidney - bilateral WO and W contrast IV |
| 36379-6 | CT Knee WO and W contrast IV |
| 36380-4 | CT Knee - left WO and W contrast IV |
| 36381-2 | CT Knee - right WO and W contrast IV |
| 36382-0 | MR Larynx WO and W contrast IV |
| 36383-8 | CT Mandible WO and W contrast IV |
| 36384-6 | MR Nasopharynx WO and W contrast IV |
| 36385-3 | MR Pancreas WO and W contrast IV |
| 36387-9 | CT Posterior fossa WO and W contrast IV |
| 36388-7 | MR Posterior fossa WO and W contrast IV |
| 36389-5 | MR Prostate WO and W contrast IV |
| 36390-3 | CT Sacrum WO and W contrast IV |
| 36391-1 | MR Sacrum WO and W contrast IV |
| 36392-9 | MR Sacrum and Coccyx WO and W contrast IV |
| 36393-7 | MR Scapula - left WO and W contrast IV |
| 36394-5 | MR Scapula - right WO and W contrast IV |
| 36395-2 | CT Shoulder WO and W contrast IV |
| 36396-0 | CT Shoulder - left WO and W contrast IV |
| 36397-8 | CT Shoulder - right WO and W contrast IV |
| 36398-6 | CT Sinuses WO and W contrast IV |
| 36399-4 | CT Spine WO and W contrast IV |
| 36400-0 | MR Spine WO and W contrast IV |
| 36401-8 | CT Cervical spine WO and W contrast IV |
| 36402-6 | CT Lumbar spine WO and W contrast IV |
| 36403-4 | CT Thoracic spine WO and W contrast IV |
| 36404-2 | MR Spleen WO and W contrast IV |
| 36405-9 | CT Sternum WO and W contrast IV |
| 36406-7 | MR Scrotum and testicle WO and W contrast IV |
| 36407-5 | MR Thyroid gland WO and W contrast IV |
| 36408-3 | CT Lower leg WO and W contrast IV |
| 36409-1 | CT Lower leg - left WO and W contrast IV |
| 36410-9 | MR Lower leg - left WO and W contrast IV |
| 36411-7 | CT Lower leg - right WO and W contrast IV |
| 36412-5 | MR Lower leg - right WO and W contrast IV |
| 36413-3 | MR Uterus WO and W contrast IV |
| 36414-1 | MRA Portal vein WO and W contrast IV |
| 36415-8 | MRA Renal vein WO and W contrast IV |
| 36416-6 | MRA Lower extremity veins WO and W contrast IV |
| 36417-4 | MRA Upper extremity veins WO and W contrast IV |
| 36418-2 | MR Inferior vena cava WO and W contrast IV |
| 36419-0 | MR Superior vena cava WO and W contrast IV |
| 36420-8 | MRA Chest vessels WO and W contrast IV |
| 36421-6 | CTA Upper extremity vessels WO and W contrast IV |
| 36422-4 | MRA Upper extremity vessels WO and W contrast IV |
| 36423-2 | MRA Neck vessels WO and W contrast IV |
| 36424-0 | CT Abdomen WO contrast |
| 36425-7 | CT Ankle WO contrast |
| 36426-5 | CT Ankle - left WO contrast |
| 36427-3 | MR Ankle - left WO contrast |
| 36428-1 | CT Ankle - right WO contrast |
| 36429-9 | MR Ankle - right WO contrast |
| 36430-7 | CT Thoracic and abdominal aorta WO contrast |
| 36431-5 | CT Abdominal Aorta WO contrast |
| 36432-3 | MRA Abdominal Aorta WO contrast |
| 36433-1 | MRA Thoracic Aorta WO contrast |
| 36434-9 | CT Appendix WO contrast |
| 36435-6 | MR Face WO contrast |
| 36436-4 | MR Breast WO contrast |
| 36437-2 | MR Breast - bilateral WO contrast |
| 36438-0 | MR Breast - left WO contrast |
| 36439-8 | MR Breast - right WO contrast |
| 36442-2 | MR Chest WO contrast |
| 36443-0 | CT Elbow WO contrast |
| 36444-8 | CT Elbow - bilateral WO contrast |
| 36445-5 | CT Elbow - left WO contrast |
| 36446-3 | MR Elbow - left WO contrast |
| 36447-1 | CT Elbow - right WO contrast |
| 36448-9 | MR Elbow - right WO contrast |
| 36449-7 | CT Lower extremity - bilateral WO contrast |
| 36450-5 | MRA Lower extremity vessels - bilateral WO contrast |
| 36451-3 | MR Lower extremity - bilateral WO contrast |
| 36452-1 | CT Lower extremity - left WO contrast |
| 36453-9 | MR Lower extremity - left WO contrast |
| 36454-7 | CT Lower extremity - right WO contrast |
| 36455-4 | MR Lower extremity - right WO contrast |
| 36456-2 | CT Upper extremity - bilateral WO contrast |
| 36457-0 | CT Upper extremity - left WO contrast |
| 36458-8 | CT Upper extremity - right WO contrast |
| 36459-6 | MR Upper extremity - right WO contrast |
| 36460-4 | CT Thigh WO contrast |
| 36461-2 | MR Thigh WO contrast |
| 36462-0 | CT Thigh - left WO contrast |
| 36463-8 | MR Thigh - left WO contrast |
| 36464-6 | CT Thigh - right WO contrast |
| 36465-3 | MR Thigh - right WO contrast |
| 36466-1 | CT Foot WO contrast |
| 36467-9 | MR Foot - bilateral WO contrast |
| 36468-7 | CT Foot - left WO contrast |
| 36469-5 | MR Foot - left WO contrast |
| 36470-3 | CT Foot - right WO contrast |
| 36471-1 | MR Foot - right WO contrast |
| 36472-9 | CT Forearm WO contrast |
| 36473-7 | CT Forearm - left WO contrast |
| 36474-5 | MR Forearm - left WO contrast |
| 36475-2 | CT Forearm - right WO contrast |
| 36476-0 | MR Forearm - right WO contrast |
| 36477-8 | CT Hand WO contrast |
| 36478-6 | CT Hand - left WO contrast |
| 36479-4 | MR Hand - left WO contrast |
| 36480-2 | CT Hand - right WO contrast |
| 36481-0 | MR Hand - right WO contrast |
| 36482-8 | MR Heart WO contrast |
| 79088-1 | CT Heart for congenital disease W contrast IV |
| 36484-4 | CT Hip WO contrast |
| 36485-1 | CT Hip - bilateral WO contrast |
| 36486-9 | MR Hip - bilateral WO contrast |
| 36487-7 | CT Hip - left WO contrast |
| 36488-5 | MR Hip - left WO contrast |
| 36489-3 | CT Hip - right WO contrast |
| 36490-1 | MR Hip - right WO contrast |
| 36491-9 | CT Upper arm WO contrast |
| 36492-7 | CT Upper arm - left WO contrast |
| 36493-5 | MR Upper arm - left WO contrast |
| 36494-3 | CT Upper arm - right WO contrast |
| 36495-0 | MR Upper arm - right WO contrast |
| 36496-8 | MR Acromioclavicular Joint WO contrast |
| 36497-6 | MR Lower Extremity Joint WO contrast |
| 36498-4 | MR Lower extremity joint - left WO contrast |
| 36499-2 | MR Lower extremity joint - right WO contrast |
| 36500-7 | MR Upper extremity.joint WO contrast |
| 36501-5 | CT Sacroiliac Joint WO contrast |
| 36502-3 | MR Sacroiliac Joint WO contrast |
| 36503-1 | CT Kidney - bilateral WO contrast |
| 36504-9 | MR Kidney - bilateral WO contrast |
| 36505-6 | CT Knee WO contrast |
| 36506-4 | MR Knee - bilateral WO contrast |
| 36507-2 | CT Knee - left WO contrast |
| 36508-0 | MR Knee - left WO contrast |
| 36509-8 | CT Knee - right WO contrast |
| 36510-6 | MR Knee - right WO contrast |
| 36511-4 | CT Larynx WO contrast |
| 36512-2 | CT Mandible WO contrast |
| 36513-0 | MR Nasopharynx WO contrast |
| 36514-8 | CT Neck WO contrast |
| 36515-5 | MR Pancreas WO contrast |
| 36516-3 | MR Brachial plexus - right WO contrast |
| 36517-1 | CT Posterior fossa WO contrast |
| 36518-9 | MR Posterior fossa WO contrast |
| 36519-7 | MR Prostate WO contrast |
| 36520-5 | CT Sacrum WO contrast |
| 36521-3 | MR Sacrum WO contrast |
| 36522-1 | MR Sacrum and Coccyx WO contrast |
| 36523-9 | MR Scapula - left WO contrast |
| 36524-7 | CT Shoulder WO contrast |
| 36525-4 | MR Shoulder - bilateral WO contrast |
| 36526-2 | CT Shoulder - left WO contrast |
| 36527-0 | CT Shoulder - right WO contrast |
| 36528-8 | MR Shoulder - right WO contrast |
| 36529-6 | CT Sinuses WO contrast |
| 36530-4 | CT Spine WO contrast |
| 36531-2 | MR Spine WO contrast |
| 36532-0 | MR Thoracic spine WO contrast |
| 36533-8 | MR Spleen WO contrast |
| 36534-6 | CT Sternum WO contrast |
| 36535-3 | MR Scrotum and testicle WO contrast |
| 36536-1 | MR Thyroid gland WO contrast |
| 36537-9 | CT Lower leg WO contrast |
| 36538-7 | CT Lower leg - left WO contrast |
| 36539-5 | MR Lower leg - left WO contrast |
| 36540-3 | CT Lower leg - right WO contrast |
| 36541-1 | MR Lower leg - right WO contrast |
| 36542-9 | MR Uterus WO contrast |
| 36543-7 | MRA Portal vein WO contrast |
| 36544-5 | MRA Renal vein WO contrast |
| 36545-2 | MR Inferior vena cava WO contrast |
| 36546-0 | MR Superior vena cava WO contrast |
| 36547-8 | MRA Chest vessels WO contrast |
| 36548-6 | MRA Upper extremity vessels WO contrast |
| 36549-4 | MRA Neck vessels WO contrast |
| 36550-2 | XR Abdomen Single view |
| 36551-0 | XR Ankle Single view |
| 36554-4 | XR Chest Single view |
| 36555-1 | XR Clavicle Single view |
| 36556-9 | XR Elbow Single view |
| 36557-7 | XR Lower extremity - bilateral Single view |
| 36558-5 | XR Lower extremity - left Single view |
| 36559-3 | XR Femur Single view |
| 36560-1 | XR Femur - left Single view |
| 36561-9 | XR Foot Single view |
| 36563-5 | XR Hand Single view |
| 36564-3 | XR Calcaneus Single view |
| 36565-0 | XR Humerus Single view |
| 36566-8 | XR Knee - bilateral Single view |
| 36567-6 | XR Knee - left Single view |
| 36568-4 | XR Shoulder - bilateral Single view |
| 36569-2 | XR Shoulder - left Single view |
| 36570-0 | XR Wrist - left Single view |
| 36571-8 | XR Ankle AP |
| 36572-6 | XR Chest AP |
| 36573-4 | XR Clavicle AP |
| 36574-2 | XR Lower extremity AP |
| 36575-9 | XR Femur AP |
| 36576-7 | XR Finger fifth AP |
| 36577-5 | XR Finger fourth AP |
| 36578-3 | XR Finger third AP |
| 36579-1 | XR Foot AP |
| 36580-9 | XR Foot - bilateral AP |
| 36581-7 | XR Hip AP |
| 36582-5 | XR Hip - left AP |
| 36583-3 | XR Acromioclavicular joint - left AP |
| 36584-1 | XR Knee AP |
| 36585-8 | XR Knee - bilateral AP |
| 36586-6 | XR Shoulder - bilateral AP |
| 36587-4 | XR Shoulder - left AP |
| 36588-2 | Portable XR Abdomen AP |
| 36589-0 | Portable XR Chest AP single view |
| 36590-8 | XR Knee - bilateral AP and Lateral |
| 36591-6 | XR Abdomen Lateral |
| 36592-4 | XR Ankle Lateral |
| 36593-2 | XR Femur Lateral |
| 36594-0 | XR Finger fifth Lateral |
| 36595-7 | XR Finger fourth Lateral |
| 36596-5 | XR Finger second Lateral |
| 36597-3 | XR Finger third Lateral |
| 36598-1 | XR Foot - left Lateral |
| 36599-9 | XR Hand Lateral |
| 36600-5 | XR Hand - bilateral Lateral |
| 36601-3 | XR Hand - left Lateral |
| 36602-1 | XR Hip Lateral |
| 36603-9 | XR Hip - left Lateral |
| 36604-7 | XR Knee Lateral |
| 36605-4 | XR Knee - bilateral Lateral |
| 36606-2 | XR Knee - left Lateral |
| 36607-0 | XR Abdomen Oblique |
| 36608-8 | XR Elbow Oblique Views |
| 36609-6 | XR Femur Oblique |
| 36610-4 | XR Finger fifth Oblique |
| 36611-2 | XR Finger fourth Oblique |
| 36612-0 | XR Finger second Oblique |
| 36613-8 | XR Finger third Oblique |
| 36614-6 | XR Foot Oblique |
| 36615-3 | XR Foot - left Oblique |
| 36616-1 | XR Hand Oblique |
| 36617-9 | XR Hip Oblique |
| 36618-7 | XR Hip - bilateral Oblique |
| 36619-5 | XR Knee Oblique Views |
| 36620-3 | XR Chest Left anterior oblique |
| 36621-1 | XR Hand PA |
| 36622-9 | XR Hand - bilateral PA |
| 36623-7 | XR Hand - left PA |
| 36624-5 | XR Wrist - bilateral PA |
| 36625-2 | MG Breast Views |
| 36626-0 | MG Breast - bilateral Views |
| 36627-8 | MG Breast - left Views |
| 36628-6 | XR Internal auditory canal Views |
| 36629-4 | XR Hand - bilateral Views |
| 36630-2 | XR Hand - left Views |
| 36631-0 | XR Pelvis and Hip - left Views |
| 36632-8 | XR Humerus - left Views |
| 36633-6 | XR Sacroiliac joint - bilateral Views |
| 36634-4 | XR Sacroiliac joint - left Views |
| 36635-1 | XR Knee - bilateral Views |
| 36636-9 | XR Knee - left Views |
| 36637-7 | XR Maxilla Views |
| 36638-5 | XR Patella - bilateral Views |
| 36639-3 | XR Patella - left Views |
| 36640-1 | RF Cervical spine Views |
| 36641-9 | XR Abdomen 2 Views |
| 36642-7 | MG Breast - left 2 Views |
| 36643-5 | XR Chest 2 Views |
| 36644-3 | XR and RF Chest 2 Views and Views |
| 36645-0 | XR Clavicle 2 Views |
| 36646-8 | XR Clavicle - left 2 Views |
| 36647-6 | XR Coccyx 2 Views |
| 36648-4 | XR Elbow 2 Views |
| 36649-2 | XR Elbow - bilateral 2 Views |
| 36650-0 | XR Elbow - left 2 Views |
| 36651-8 | XR Lower extremity 2 Views |
| 36652-6 | XR Femur 2 Views |
| 36653-4 | XR Femur - bilateral 2 Views |
| 36654-2 | XR Femur - left 2 Views |
| 36655-9 | XR Finger 2 Views |
| 36656-7 | XR Finger - left 2 Views |
| 36657-5 | XR Foot - bilateral 2 Views |
| 36658-3 | XR Radius and Ulna 2 Views |
| 36659-1 | XR Radius and Ulna - bilateral 2 Views |
| 36660-9 | XR Radius and Ulna - left 2 Views |
| 36661-7 | XR Calcaneus 2 Views |
| 36662-5 | XR Calcaneus - left 2 Views |
| 36663-3 | XR Hip 2 Views |
| 36664-1 | XR Hip - left 2 Views |
| 36665-8 | XR Acromioclavicular joint - left 2 Views |
| 36666-6 | XR Scapula - left 2 Views |
| 36667-4 | XR Shoulder - bilateral 2 Views |
| 36668-2 | XR Shoulder - left 2 Views |
| 36669-0 | XR Cervical spine 2 Views |
| 36670-8 | XR Lumbar spine 2 Views |
| 36671-6 | XR Tibia and Fibula - bilateral 2 Views |
| 36672-4 | XR Tibia and Fibula - left 2 Views |
| 36673-2 | XR Toes - left 2 Views |
| 36674-0 | Portable XR Lumbar spine 2 Views |
| 36675-7 | XR Facial bones 5 Views |
| 36676-5 | XR Knee - left 5 Views |
| 36677-3 | XR Shoulder - left 5 Views |
| 36678-1 | XR Knee - bilateral 6 Views |
| 36679-9 | XR Shoulder - left 6 Views |
| 36680-7 | XR Cervical spine 7 Views |
| 36681-5 | XR Lumbar spine 7 Views |
| 36682-3 | XR Knee - bilateral 8 Views |
| 36683-1 | XR Wrist - left 8 Views |
| 36684-9 | XR Ankle - bilateral AP and Lateral |
| 36685-6 | XR Ankle - left AP and Lateral |
| 36686-4 | XR Calcaneus - bilateral AP and Lateral |
| 36687-2 | XR Chest AP and Lateral |
| 36688-0 | XR Coccyx AP and Lateral |
| 36689-8 | XR Elbow AP and Lateral |
| 36690-6 | XR Elbow - bilateral AP and Lateral |
| 36691-4 | XR Elbow - left AP and Lateral |
| 36692-2 | XR Lower extremity AP and Lateral |
| 36693-0 | XR Femur AP and Lateral |
| 36694-8 | XR Femur - bilateral AP and Lateral |
| 36695-5 | XR Femur - left AP and Lateral |
| 36696-3 | XR Foot - bilateral AP and Lateral |
| 36697-1 | XR Foot - left AP and Lateral |
| 36698-9 | XR Radius and Ulna AP and Lateral |
| 36699-7 | XR Radius and Ulna - bilateral AP and Lateral |
| 36700-3 | XR Radius and Ulna - left AP and Lateral |
| 36701-1 | XR Calcaneus - left AP and Lateral |
| 36702-9 | XR Hip AP and Lateral |
| 36703-7 | XR Hip - bilateral AP and Lateral |
| 36704-5 | XR Hip - left AP and Lateral |
| 36705-2 | XR Pelvis and Hip AP and Lateral |
| 36706-0 | XR Humerus AP and Lateral |
| 36707-8 | XR Humerus - bilateral AP and Lateral |
| 36708-6 | XR Humerus - left AP and Lateral |
| 36709-4 | XR Knee AP and Lateral |
| 36710-2 | XR Knee - left AP and Lateral |
| 36711-0 | XR Mandible AP and Lateral |
| 36712-8 | XR Patella - bilateral AP and Lateral |
| 36713-6 | XR Patella - left AP and Lateral |
| 36714-4 | XR Scapula - bilateral AP and Lateral |
| 36715-1 | XR Scapula - left AP and Lateral |
| 36716-9 | XR Shoulder - bilateral AP and Lateral |
| 36717-7 | XR Tibia and Fibula - bilateral AP and Lateral |
| 36718-5 | XR Tibia and Fibula - left AP and Lateral |
| 36719-3 | XR Toes - left AP and Lateral |
| 36720-1 | XR Ankle - bilateral AP and Lateral and oblique |
| 36721-9 | XR Ankle - left AP and Lateral and oblique |
| 36722-7 | XR Elbow AP and Lateral and oblique |
| 36723-5 | XR Elbow - bilateral AP and Lateral and oblique |
| 36724-3 | XR Elbow - left AP and Lateral and oblique |
| 36725-0 | XR Finger AP and Lateral and oblique |
| 36726-8 | XR Finger - bilateral AP and Lateral and oblique |
| 36727-6 | XR Finger - left AP and Lateral and oblique |
| 36728-4 | XR Foot AP and Lateral and oblique |
| 36729-2 | XR Foot - bilateral AP and Lateral and oblique |
| 36730-0 | XR Foot - left AP and Lateral and oblique |
| 36731-8 | XR Calcaneus AP and Lateral and oblique |
| 36732-6 | XR Knee - bilateral AP and Lateral and oblique |
| 36733-4 | XR Knee - left AP and Lateral and oblique |
| 36734-2 | XR Cervical spine AP and Lateral and oblique |
| 36735-9 | XR Lumbar spine AP and Lateral and oblique |
| 36736-7 | XR Thumb - left AP and Lateral and oblique |
| 36737-5 | XR Facial bones Limited Views |
| 36738-3 | XR Mandible Limited Views |
| 36739-1 | XR Wrist - bilateral Limited Views |
| 36740-9 | XR Elbow - bilateral Oblique Views |
| 36741-7 | XR Elbow - left Oblique Views |
| 36742-5 | XR Radius and Ulna - bilateral Oblique Views |
| 36743-3 | XR Radius and Ulna - left Oblique Views |
| 36744-1 | XR Humerus - left Oblique Views |
| 36745-8 | XR Knee - bilateral Oblique Views |
| 36746-6 | XR Knee - left Oblique Views |
| 36747-4 | XR Mandible Oblique Views |
| 36748-2 | XR Cervical spine Oblique Views |
| 36749-0 | XR Tibia and Fibula - left Oblique Views |
| 36750-8 | XR Chest PA and AP lateral-decubitus |
| 36751-6 | XR and RF Chest PA and Lateral and Views |
| 36752-4 | XR Hand - bilateral PA and Lateral |
| 36753-2 | XR Hand - left PA and Lateral |
| 36754-0 | XR Mandible PA and Lateral |
| 36755-7 | XR Hand PA and Lateral and Oblique |
| 36756-5 | XR Hand - bilateral PA and Lateral and Oblique |
| 36757-3 | XR Hand - left PA and Lateral and Oblique |
| 36758-1 | XR Chest PA and Lateral and Oblique and Apical lordotic |
| 36759-9 | XR Chest PA and Apical lordotic |
| 36760-7 | RFA Guidance for angioplasty of AV shunt-- W contrast |
| 36761-5 | RF Guidance for balloon dilatation of Biliary ducts-- W contrast |
| 36762-3 | RFA Guidance for angioplasty of Extremity vessel-- W contrast |
| 36763-1 | RFA Guidance for angioplasty of Femoral artery and Popliteal artery-- W contrast IA |
| 36764-9 | RFA Guidance for atherectomy of Femoral vessel and Popliteal artery-- W contrast |
| 36765-6 | RFA Guidance for atherectomy of Vessel-- W contrast |
| 36766-4 | RFA Guidance for atherectomy of Coronary arteries-- W contrast IA |
| 36767-2 | CT Guidance for biopsy of Adrenal gland |
| 36768-0 | CT Guidance for percutaneous biopsy of Muscle |
| 36769-8 | CT Guidance for exchange of nephrostomy tube of Kidney |
| 36770-6 | CT Guidance for drainage and placement of drainage catheter of Biliary ducts and Gallbladder |
| 36771-4 | RF Guidance for injection of Joint |
| 36772-2 | CT Guidance for placement of nephrostomy tube in Kidney |
| 36773-0 | CT Temporal bone |
| 36774-8 | MR Upper extremity joint - left |
| 36775-5 | MR Upper extremity joint - right |
| 36776-3 | XR tomography Mastoid |
| 36777-1 | MR Orbit |
| 36778-9 | MR Orbit - right |
| 36779-7 | MR Ovary |
| 36780-5 | MR Toe |
| 36781-3 | MRA Abdominal veins |
| 36782-1 | MRA Subclavian artery |
| 36783-9 | MRA Veins |
| 36784-7 | MRA Lower extremity veins - left |
| 36785-4 | MRA Lower extremity veins - right |
| 36786-2 | MRA Upper extremity veins - left |
| 36787-0 | MRA Upper extremity veins - right |
| 36788-8 | MRA Neck veins |
| 36789-6 | MRA Pelvis veins |
| 36790-4 | MRA Inferior vena cava + tributaries |
| 36791-2 | MRA Abdominal vessels |
| 36792-0 | MRA Adrenal vessels |
| 36794-6 | MRA Extremity vessels |
| 36795-3 | MRA Lower extremity vessels - left |
| 36796-1 | MRA Lower extremity vessels - right |
| 36797-9 | MRA Upper extremity vessels - left |
| 36798-7 | MRA Upper extremity vessels - right |
| 36799-5 | MRA Knee vessels |
| 36800-1 | MRA Knee vessels - left |
| 36801-9 | MRA Knee vessels - right |
| 36802-7 | MRA Orbit vessels |
| 36803-5 | MRA Pulmonary vessels |
| 36804-3 | MRA Renal vessels - bilateral |
| 36805-0 | MRA Shoulder vessels |
| 36806-8 | MRA Shoulder vessels - left |
| 36807-6 | MRA Shoulder vessels - right |
| 36808-4 | MRA Head vessels limited |
| 36809-2 | CTA Hepatic artery W contrast IA |
| 36811-8 | CT Joint Arthrogram |
| 36812-6 | MR Joint Arthrogram |
| 36813-4 | CT Abdomen and Pelvis W contrast IV |
| 36814-2 | CTA Head Arteries W contrast IV |
| 36815-9 | CT Temporal bone W contrast IV |
| 36816-7 | CT Temporal bone - right W contrast IV |
| 36817-5 | MR Upper extremity joint - bilateral W contrast IV |
| 36818-3 | MR Upper extremity joint - left W contrast IV |
| 36819-1 | MR Upper extremity joint - right W contrast IV |
| 36820-9 | MR Orbit W contrast IV |
| 36821-7 | MR Orbit - left W contrast IV |
| 36822-5 | MR Orbit - right W contrast IV |
| 36823-3 | MR Ovary W contrast IV |
| 36824-1 | CTA Lower extremity veins - left W contrast IV |
| 36825-8 | CTA Lower extremity veins - right W contrast IV |
| 36826-6 | MRA Head veins W contrast IV |
| 36827-4 | MRA Neck veins W contrast IV |
| 36828-2 | CTA Abdominal vessels W contrast IV |
| 36830-8 | CTA Head vessels W contrast IV |
| 36831-6 | CTA Lower extremity vessels W contrast IV |
| 36832-4 | MRA Orbit vessels W contrast IV |
| 36833-2 | CTA Renal vessels W contrast IV |
| 36834-0 | CTA Vessel W contrast IV |
| 36835-7 | CT Petrous part of temporal bone WO and W contrast IV |
| 36837-3 | CT Temporal bone WO and W contrast IV |
| 36838-1 | XR Mastoid 3 Views |
| 36839-9 | XR Mastoid 4 Views |
| 36840-7 | MR Upper extremity joint - left WO and W contrast IV |
| 36841-5 | MR Upper extremity joint - right WO and W contrast IV |
| 36842-3 | MR Orbit WO and W contrast IV |
| 36843-1 | MR Orbit - left WO and W contrast IV |
| 36844-9 | MR Orbit - right WO and W contrast IV |
| 36845-6 | MR Ovary WO and W contrast IV |
| 36846-4 | MRA Abdominal veins WO and W contrast IV |
| 36847-2 | MRA Head veins WO and W contrast IV |
| 36848-0 | MRA Chest veins WO and W contrast IV |
| 36849-8 | MRA Lower extremity veins - left WO and W contrast IV |
| 36850-6 | MRA Lower extremity veins - right WO and W contrast IV |
| 36851-4 | MRA Upper extremity veins - left WO and W contrast IV |
| 36852-2 | MRA Upper extremity veins - right WO and W contrast IV |
| 36853-0 | MRA Neck veins WO and W contrast IV |
| 36854-8 | MRA Pelvis veins WO and W contrast IV |
| 36855-5 | MRA Abdominal vessels WO and W contrast IV |
| 36857-1 | MRA Head vessels WO and W contrast IV |
| 36858-9 | MRA Lower extremity vessels - left WO and W contrast IV |
| 36859-7 | MRA Lower extremity vessels - right WO and W contrast IV |
| 36860-5 | MRA Upper extremity vessels - left WO and W contrast IV |
| 36861-3 | MRA Upper extremity vessels - right WO and W contrast IV |
| 36862-1 | MRA Knee vessels - right WO and W contrast IV |
| 36863-9 | MRA Pelvis vessels WO and W contrast IV |
| 36864-7 | MRA Shoulder vessels - left WO and W contrast IV |
| 36865-4 | MRA Shoulder vessels - right WO and W contrast IV |
| 36866-2 | CT Temporal bone WO contrast |
| 36867-0 | CT Temporal bone - left WO contrast |
| 36868-8 | CT Temporal bone - right WO contrast |
| 36869-6 | MR Upper extremity joint - left WO contrast |
| 36870-4 | MR Upper extremity joint - right WO contrast |
| 36871-2 | MR Joint WO contrast |
| 36872-0 | MR Orbit WO contrast |
| 36873-8 | MR Orbit - left WO contrast |
| 36874-6 | MR Orbit - right WO contrast |
| 36875-3 | MR Ovary WO contrast |
| 36876-1 | MRA Head veins WO contrast |
| 36877-9 | MRA Neck veins WO contrast |
| 36878-7 | MRA Abdominal vessels WO contrast |
| 36879-5 | MRA Ankle vessels WO contrast |
| 36881-1 | MRA Head vessels WO contrast |
| 36882-9 | MRA Lower extremity vessels - left WO contrast |
| 36883-7 | MRA Pelvis vessels WO contrast |
| 36886-0 | XR Orbit Views |
| 36887-8 | XR Orbit - left Views |
| 36890-2 | XR Mastoid 5 Views |
| 36893-6 | XR Mastoid Limited Views |
| 36894-4 | XR Tibia and Fibula Oblique Views |
| 36927-2 | CT Guidance for biopsy of Maxillofacial region |
| 36928-0 | CT Guidance for stereotactic biopsy of Head |
| 36929-8 | CT Guidance for stereotactic biopsy of Head-- WO contrast |
| 36930-6 | CT Adrenal gland |
| 36931-4 | MR Adrenal gland |
| 36932-2 | CT Pituitary and Sella turcica |
| 36933-0 | MR Salivary gland |
| 86975-0 | CT Heart for left ventricular function W contrast IV |
| 79089-9 | CT Heart W contrast IV |
| 36936-3 | MR Guidance for stereotactic biopsy of Brain |
| 36937-1 | CT Maxillofacial region limited |
| 36938-9 | CT Maxillofacial region limited WO contrast |
| 36941-3 | CT Salivary gland W contrast intra salivary duct |
| 36942-1 | MR Chest and Abdomen W contrast IV |
| 36943-9 | CT Adrenal gland W contrast IV |
| 36944-7 | MR Biliary ducts and Pancreatic duct WO and W contrast IV |
| 36945-4 | XR Knee - bilateral 2 Views W standing |
| 36946-2 | XR Lumbar spine 2 Views W standing |
| 36947-0 | XR Foot - bilateral 3 Views W standing |
| 36948-8 | XR Foot - left 3 Views W standing |
| 36949-6 | XR Lumbar spine 3 Views W standing |
| 36950-4 | CT Adrenal gland WO and W contrast IV |
| 36951-2 | MR Adrenal gland WO and W contrast IV |
| 36952-0 | CT Abdomen and Pelvis WO contrast |
| 36953-8 | CT Adrenal gland WO contrast |
| 36954-6 | MR Adrenal gland WO contrast |
| 36955-3 | CT Thyroid gland WO contrast |
| 36956-1 | MR Orbit and Face WO contrast |
| 36958-7 | XR Ribs - bilateral AP |
| 36959-5 | XR Ribs - left AP |
| 36960-3 | Portable XR Chest AP upright |
| 36961-1 | XR Shoulder - left AP and West Point and Outlet |
| 36962-9 | MG Breast Axillary |
| 36963-7 | XR Shoulder - bilateral Axillary |
| 36964-5 | XR Shoulder - left Axillary |
| 36965-2 | XR Hand Ball Catcher |
| 36966-0 | XR Hand - bilateral Brewerton |
| 36967-8 | XR Hand - left Brewerton |
| 36968-6 | XR Wrist - bilateral Single view W clenched fist |
| 36971-0 | XR Wrist - left Lateral W extension |
| 36972-8 | XR Wrist - left Lateral W flexion |
| 36973-6 | XR Hip Friedman |
| 36974-4 | XR Shoulder - left Garth |
| 36975-1 | XR Calcaneus - bilateral Harris |
| 36976-9 | XR Foot Harris |
| 36977-7 | XR Calcaneus - left Harris |
| 36978-5 | XR Knee Holmblad |
| 36979-3 | XR Elbow Jones |
| 36980-1 | XR Elbow - left Jones |
| 36981-9 | XR Hip Judet |
| 36982-7 | XR Hip - bilateral Judet |
| 36983-5 | XR Hip - left Judet |
| 36984-3 | XR Abdomen Lateral crosstable |
| 36985-0 | XR Hip Lateral crosstable |
| 36986-8 | XR Hip - bilateral Lateral crosstable |
| 36987-6 | XR Hip - left Lateral crosstable |
| 36988-4 | XR Knee Lateral crosstable |
| 36989-2 | XR Cervical spine Lateral crosstable |
| 36990-0 | XR Lumbar spine Lateral crosstable |
| 36991-8 | Portable XR Cervical spine Lateral crosstable |
| 36992-6 | Portable XR Lumbar spine Lateral crosstable |
| 36993-4 | XR Hip - bilateral Lateral frog |
| 36994-2 | XR Hip - left Lateral frog |
| 36995-9 | XR Abdomen Left lateral |
| 36996-7 | XR Abdomen Right lateral |
| 36997-5 | XR Cervical spine Lateral W extension |
| 36998-3 | XR Cervical spine Lateral W flexion |
| 36999-1 | XR Knee - bilateral Lateral W extension |
| 37000-7 | XR Knee - left Lateral W extension |
| 37001-5 | XR Foot Lateral W standing |
| 37002-3 | XR Knee - left Lateral W standing |
| 37003-1 | XR Lumbar spine Lateral W standing |
| 37004-9 | XR Knee Laurin |
| 37005-6 | MG Breast - left Magnification |
| 37006-4 | MG Breast - bilateral MLO |
| 37007-2 | XR Ankle Mortise |
| 37008-0 | XR Chest Left oblique |
| 37009-8 | XR Lumbar spine Left oblique |
| 37010-6 | XR Chest Right oblique |
| 37011-4 | XR Lumbar spine Right oblique |
| 37012-2 | XR Shoulder - bilateral Outlet |
| 37013-0 | XR Shoulder - left Outlet |
| 37014-8 | XR Knee - left PA W standing |
| 37015-5 | XR Abdomen PA prone |
| 37016-3 | MG Breast - bilateral Rolled Views |
| 37017-1 | MG Breast - left Rolled Views |
| 37018-9 | XR Knee Rosenberg W standing |
| 37019-7 | XR Knee - left Rosenberg W standing |
| 37020-5 | XR Knee - bilateral Rosenberg W standing |
| 37021-3 | XR Calcaneus - bilateral Ski jump Views |
| 37022-1 | XR Calcaneus Ski jump Views |
| 37023-9 | XR Calcaneus - left Ski jump Views |
| 37024-7 | XR Shoulder - bilateral Stryker Notch |
| 37025-4 | XR Shoulder - left Stryker Notch |
| 37026-2 | XR Skull Submentovertex |
| 37027-0 | XR Knee - bilateral Sunrise |
| 37028-8 | MG Breast Tangential |
| 37029-6 | MG Breast - bilateral Tangential |
| 37030-4 | MG Breast - left Tangential |
| 37031-2 | XR Humerus Transthoracic |
| 37032-0 | XR Humerus - bilateral Transthoracic |
| 37033-8 | XR Humerus - left Transthoracic |
| 37034-6 | XR Shoulder - left Transthoracic |
| 37035-3 | XR Shoulder - bilateral Grashey |
| 37037-9 | MG Breast True lateral |
| 37038-7 | MG Breast - bilateral True lateral |
| 37039-5 | XR Hip True lateral |
| 37040-3 | XR Hip - left True lateral |
| 37041-1 | XR Knee - bilateral Tunnel |
| 37042-9 | XR Knee - left Tunnel |
| 37043-7 | XR Knee - left Tunnel W standing |
| 37044-5 | XR Wrist - left Ulnar deviation |
| 37045-2 | XR Wrist - bilateral Ulnar deviation |
| 37046-0 | XR Abdomen Upright |
| 37047-8 | XR Shoulder - bilateral Velpeau axillary |
| 37048-6 | XR Shoulder - left Velpeau axillary |
| 37049-4 | XR Hip Von Rosen |
| 37050-2 | XR Shoulder - bilateral West Point |
| 37051-0 | XR Shoulder - left West Point |
| 37052-8 | MG Breast - bilateral XCCL |
| 37053-6 | MG Breast - left XCCL |
| 37054-4 | XR Scapula - left Y |
| 37055-1 | XR Scapula - bilateral Y |
| 37056-9 | XR Acromioclavicular joint - bilateral Zanca |
| 37057-7 | XR Acromioclavicular joint - left Zanca |
| 37058-5 | XR Calcaneus - bilateral Single view W standing |
| 37059-3 | XR Hip - bilateral Single view W standing |
| 37060-1 | XR Fetal Views |
| 37062-7 | XR Humerus - bilateral Views |
| 37063-5 | RF Unspecified body region Views for foreign body |
| 37064-3 | XR Acetabulum - left 2 Views |
| 37066-8 | XR Ribs - left 2 Views |
| 37067-6 | XR Chest 2 Views W nipple markers |
| 37068-4 | XR Foot - bilateral 2 Views W standing |
| 37069-2 | XR Foot - left 2 Views W standing |
| 37070-0 | XR Wrist - bilateral 4 Views |
| 37071-8 | XR Wrist - left 4 Views |
| 37072-6 | XR Wrist - left 5 Views |
| 37073-4 | XR Lumbar spine 5 Views W standing |
| 37074-2 | XR Wrist - left 6 Views |
| 37075-9 | Portable XR Hip Views AP |
| 37076-7 | Portable XR Abdomen Supine and Lateral-decubitus |
| 37077-5 | Portable XR Hip AP and Lateral crosstable |
| 37078-3 | Portable XR Lumbar spine AP and Lateral |
| 37079-1 | Portable XR Cervical spine AP and Lateral and Odontoid |
| 37080-9 | XR Shoulder - bilateral AP and Axillary |
| 37081-7 | XR Shoulder - bilateral AP and Axillary and Outlet |
| 37082-5 | XR Shoulder - left AP and Axillary and Outlet |
| 37083-3 | XR Shoulder - left AP and Axillary and Outlet and Zanca |
| 37084-1 | XR Shoulder - left AP and Axillary and Y |
| 37085-8 | XR Abdomen Supine and Lateral-decubitus |
| 37086-6 | XR Hip AP and Lateral crosstable |
| 37087-4 | XR Hip - left AP and Lateral crosstable |
| 37088-2 | XR Pelvis and Hip - left AP and Lateral crosstable |
| 37089-0 | XR Pelvis and Hip AP and Lateral crosstable |
| 37090-8 | XR Knee AP and Lateral crosstable |
| 37091-6 | XR Hip AP and Lateral frog |
| 37092-4 | XR Hip - bilateral AP and Lateral frog |
| 37093-2 | XR Hip - left AP and Lateral frog |
| 37094-0 | XR Pelvis and Hip - left AP and Lateral frog |
| 37095-7 | XR Ankle AP and Lateral and Mortise |
| 37096-5 | XR Ankle - bilateral AP and Lateral and Mortise |
| 37097-3 | XR Ankle - left AP and Lateral and Mortise |
| 37098-1 | XR Cervical spine AP and Oblique and (Lateral W flexion and W extension) |
| 37099-9 | XR Cervical spine AP and Lateral and Oblique and Odontoid |
| 37100-5 | XR Cervical spine AP and Oblique and Odontoid and (Lateral W flexion and W extension) |
| 37101-3 | XR Lumbar spine AP and Lateral and Oblique and Spot |
| 37102-1 | XR Knee - bilateral AP and Lateral and Oblique and Sunrise |
| 37103-9 | XR Cervical spine AP and Lateral and Odontoid |
| 37104-7 | XR Cervical spine AP and Odontoid and (Lateral W flexion and W extension) |
| 37105-4 | XR Lumbar spine AP and Lateral and Spot |
| 37106-2 | XR Knee AP and Lateral and Sunrise |
| 37107-0 | XR Knee - bilateral AP and Lateral and Sunrise |
| 37108-8 | XR Knee - left AP and Lateral and Sunrise |
| 37109-6 | XR Patella - bilateral AP and Lateral and Sunrise |
| 37110-4 | XR Patella - left AP and Lateral and Sunrise |
| 37111-2 | XR Knee AP and Lateral and Sunrise and tunnel |
| 37112-0 | XR Knee AP and Lateral and Tunnel |
| 37113-8 | XR Knee - bilateral AP and Lateral and Tunnel |
| 37114-6 | XR Knee - left AP and Lateral and Tunnel |
| 37115-3 | XR Knee AP and Lateral and Oblique and Tunnel |
| 37116-1 | XR Knee - bilateral AP and Lateral and Sunrise and tunnel |
| 37117-9 | XR Knee - left AP and Lateral and Sunrise and tunnel |
| 37118-7 | XR Knee - bilateral AP and Lateral and Oblique and Sunrise and Tunnel |
| 37119-5 | XR Abdomen AP and Oblique |
| 37120-3 | XR Cervical spine AP and Odontoid and Lateral crosstable |
| 37121-1 | XR Clavicle - left AP and Serendipity |
| 37122-9 | XR Shoulder - left AP and Stryker Notch |
| 37123-7 | XR Shoulder - left AP and West Point |
| 37124-5 | XR Scapula - left AP and Y |
| 37125-2 | XR Shoulder - left AP and Y |
| 37126-0 | XR Shoulder - bilateral AP and Axillary and Y |
| 37127-8 | XR Shoulder - bilateral Axillary and Y |
| 37128-6 | XR Shoulder - left Axillary and Y |
| 37131-0 | XR Abdomen Right lateral and Left lateral |
| 37132-8 | XR Lumbar spine Lateral Views W flexion and W extension |
| 37133-6 | XR Cervical spine Lateral Views W flexion and W extension |
| 37134-4 | XR Ankle - bilateral Lateral and Mortise |
| 37135-1 | XR Ankle - left Lateral and Mortise |
| 37136-9 | XR Shoulder - left Lateral and Y |
| 37137-7 | XR Kidney Limited Views W contrast IV |
| 37138-5 | XR Abdomen Right oblique and Left oblique |
| 37139-3 | XR Cervical spine Oblique and (Lateral W flexion and W extension) |
| 37140-1 | XR Shoulder - left Outlet and Y |
| 37141-9 | XR Chest PA and Right lateral |
| 37142-7 | XR Hand - bilateral PA and Lateral and Ball Catcher |
| 37143-5 | XR Chest PA and Lateral and AP lateral-decubitus |
| 37144-3 | XR Chest PA and Lateral and AP left lateral-decubitus |
| 37145-0 | XR Chest PA and Lateral and AP right lateral-decubitus |
| 37146-8 | XR Chest PA and Lateral and Left oblique |
| 37147-6 | XR Chest PA and Lateral and Right oblique |
| 37148-4 | XR Mandible PA and Lateral and Oblique and Towne |
| 37149-2 | XR Patella - left PA and Lateral and Sunrise |
| 37150-0 | XR Chest PA and Right oblique and Left oblique |
| 37151-8 | Portable RF Unspecified body region Views |
| 37152-6 | XR Shoulder - bilateral Outlet and Y |
| 37153-4 | XR Mastoid Stenver and Arcelin |
| 37154-2 | XR Knee Oblique and Sunrise |
| 37155-9 | XR Knee Oblique and Sunrise and Tunnel |
| 37156-7 | XR Knee - left Sunrise and Tunnel |
| 37157-5 | XR Shoulder - left Grashey and Outlet |
| 37158-3 | XR Shoulder - left Grashey and Axillary and Outlet |
| 37160-9 | XR Shoulder - left Grashey and Axillary |
| 37161-7 | XR Shoulder - bilateral Grashey and Axillary and Outlet and Zanca |
| 37162-5 | XR Shoulder - left Grashey and Outlet and Serendipity |
| 37163-3 | XR Knee - bilateral Sunrise and Tunnel |
| 37164-1 | XR Facial bones Lateral and Caldwell and Waters |
| 37165-8 | XR Facial bones Lateral and Caldwell and Waters and Submentovertex |
| 37166-6 | XR Facial bones Lateral and Caldwell and Waters and Submentovertex and Towne |
| 37167-4 | XR Shoulder - left Grashey and West Point |
| 37168-2 | Portable XR Hip Views |
| 37169-0 | Portable XR Hip - left Views |
| 37170-8 | Portable XR Humerus Views |
| 37171-6 | Portable XR Cervical spine Views |
| 37172-4 | Portable XR Lumbar spine Views |
| 37173-2 | RFA Cerebral artery Views W contrast IA |
| 37174-0 | RFA Coronary arteries Views W contrast IA |
| 37175-7 | RFA Femoral artery Views W contrast IA |
| 37176-5 | RFA Femoral artery and Popliteal artery Views W contrast IA |
| 37177-3 | RFA Iliac artery - bilateral Views W contrast IA |
| 37178-1 | RFA Iliac artery - left Views W contrast IA |
| 37179-9 | RFA Inferior mesenteric artery Views W contrast IA |
| 37180-7 | RFA Superior mesenteric artery Views W contrast IA |
| 37181-5 | RFA Popliteal artery - left Views W contrast IA |
| 37182-3 | RFA Pulmonary arteries - left Views W contrast IA |
| 37183-1 | RF Ankle Arthrogram |
| 37184-9 | RF Ankle - bilateral Arthrogram |
| 37185-6 | RF Ankle - left Arthrogram |
| 37186-4 | RF Elbow Arthrogram |
| 37187-2 | RF Elbow - bilateral Arthrogram |
| 37188-0 | RF Elbow - left Arthrogram |
| 37189-8 | RF Sacroiliac joint - bilateral Arthrogram |
| 37190-6 | RF Sacroiliac joint - left Arthrogram |
| 37191-4 | RF Joint Arthrogram |
| 37192-2 | RF Cervical spine Views W contrast intradisc |
| 37193-0 | RF Lumbar spine Views W contrast intradisc |
| 37195-5 | RFA Cerebral vein Views W contrast IV |
| 37196-3 | RFA Lower extremity veins - left Views W contrast IV |
| 37198-9 | XR Esophagus Views W contrast PO |
| 37199-7 | RF Chest Views W contrast PO |
| 37200-3 | XR Chest Views W contrast PO |
| 37201-1 | XR Ankle Views W standing |
| 37202-9 | XR Ankle - bilateral Views W standing |
| 37203-7 | XR Ankle - left Views W standing |
| 37204-5 | XR Lower extremity Views W standing |
| 37205-2 | XR Calcaneus Views W standing |
| 37206-0 | XR Calcaneus - left Views W standing |
| 37207-8 | XR Hip - left Single view W standing |
| 37208-6 | XR Lumbar spine Views W standing |
| 37209-4 | XR Toes - left Views W standing |
| 37210-2 | CT Guidance for aspiration of cyst of Abdomen |
| 37211-0 | CT Guidance for biopsy of Bone marrow |
| 37212-8 | CT Guidance for biopsy of Epididymis |
| 37213-6 | CT Guidance for biopsy of Mediastinum |
| 37214-4 | CT Guidance for superficial biopsy of Tissue |
| 37215-1 | MR Brain and Larynx W contrast IV |
| 37217-7 | MR Brain stem and Cranial nerves |
| 37218-5 | MR Brain.temporal |
| 37219-3 | MR Biliary ducts |
| 37220-1 | MR Biliary ducts and Pancreatic duct |
| 37221-9 | CT Unspecified body region for fistula |
| 37222-7 | MR Ankle and Foot |
| 37223-5 | CT Parotid gland |
| 37224-3 | MR Parotid gland |
| 37225-0 | CT Sternoclavicular Joint |
| 37226-8 | CT Temporomandibular joint |
| 37227-6 | XR tomography Temporomandibular joint - bilateral |
| 37228-4 | MR Temporomandibular joint - bilateral |
| 37229-2 | XR tomography Temporomandibular joint - left |
| 37230-0 | MR Temporomandibular joint - left |
| 37231-8 | MR Temporomandibular joint - right |
| 37232-6 | CT Spine lumbosacral junction |
| 37233-4 | XR tomography Mediastinum |
| 37234-2 | MR Mediastinum |
| 37235-9 | MRA Circle of Willis |
| 37237-5 | CT Sinus tract W contrast intra sinus tract |
| 37238-3 | CT Lower Extremity Joint Arthrogram |
| 37239-1 | MR Brain and Internal auditory canal W contrast IV |
| 37240-9 | CT Parotid gland W contrast IV |
| 37241-7 | MR Parotid gland W contrast IV |
| 37242-5 | CT Sternoclavicular Joint W contrast IV |
| 37243-3 | CT Temporomandibular joint W contrast IV |
| 37244-1 | MR Temporomandibular joint W contrast IV |
| 37245-8 | MR Temporomandibular joint - bilateral W contrast IV |
| 37246-6 | CT Temporomandibular joint - left W contrast IV |
| 37247-4 | MR Temporomandibular joint - left W contrast IV |
| 37248-2 | CT Temporomandibular joint - right W contrast IV |
| 37249-0 | MR Temporomandibular joint - right W contrast IV |
| 37253-2 | MR Soft tissue W contrast IV |
| 37254-0 | MRA Circle of Willis W contrast IV |
| 37256-5 | XR Pelvis and Spine Lumbar 3 Views |
| 37257-3 | XR Spine Lumbar and Sacroiliac Joint 3 Views |
| 37259-9 | XR Spine Lumbar and Sacrum 3 Views |
| 37260-7 | XR Spine Lumbar and Sacrum and Coccyx 3 Views |
| 37261-5 | XR Lumbar spine and Sacrum and SI joint and Coccyx 3 Views |
| 37265-6 | MR Parotid gland WO and W contrast IV |
| 37266-4 | CT Sternoclavicular Joint WO and W contrast IV |
| 37267-2 | CT Temporomandibular joint WO and W contrast IV |
| 37268-0 | MR Temporomandibular joint WO and W contrast IV |
| 37269-8 | MR Temporomandibular joint - bilateral WO and W contrast IV |
| 37270-6 | MR Temporomandibular joint - left WO and W contrast IV |
| 37271-4 | MR Temporomandibular joint - right WO and W contrast IV |
| 37272-2 | MR Mediastinum WO and W contrast IV |
| 37277-1 | MRA Spinal veins WO and W contrast IV |
| 37278-9 | MR Brain and Internal auditory canal WO contrast |
| 37279-7 | MR Brain and Larynx WO contrast |
| 37280-5 | CT Parotid gland WO contrast |
| 37281-3 | MR Parotid gland WO contrast |
| 37282-1 | CT Sternoclavicular Joint WO contrast |
| 37283-9 | CT Temporomandibular joint WO contrast |
| 37284-7 | MR Temporomandibular joint WO contrast |
| 37285-4 | MR Temporomandibular joint - bilateral WO contrast |
| 37286-2 | MR Temporomandibular joint - left WO contrast |
| 37287-0 | MR Temporomandibular joint - right WO contrast |
| 37288-8 | CT Spine lumbosacral junction WO contrast |
| 37293-8 | MR Soft tissue WO contrast |
| 37297-9 | XR Abdomen and Fetal Single view for fetal age |
| 37298-7 | XR Sternoclavicular joint - bilateral Serendipity |
| 37299-5 | XR Sternoclavicular joint - left Serendipity |
| 37300-1 | XR Spine lumbosacral junction True AP |
| 37302-7 | XR Wrist - left Scaphoid Views |
| 37303-5 | XR Facial bones and Zygomatic arch Views |
| 37304-3 | XR Wrist - bilateral Scaphoid Views |
| 37319-1 | XR Humerus bicipital groove Views |
| 37320-9 | XR Humerus bicipital groove - left Views |
| 37321-7 | XR Humerus bicipital groove - bilateral Views |
| 37323-3 | XR Sternoclavicular joint - bilateral Views |
| 37324-1 | XR Sternoclavicular joint - left Views |
| 37325-8 | XR Temporomandibular joint - bilateral Views |
| 37332-4 | XR Olecranon - left Views |
| 37338-1 | XR Skull and Facial bones and Mandible Views |
| 37340-7 | XR Spine Lumbar and Sacrum Views |
| 37341-5 | XR Spine Lumbar and Sacrum and Coccyx Views |
| 37342-3 | XR Lumbar spine and Sacrum and SI joint and Coccyx Views |
| 37348-0 | XR Toes - bilateral 2 Views |
| 37350-6 | XR Temporomandibular joint - bilateral 5 Views |
| 37351-4 | XR Pelvis and Spine Lumbar 5 Views |
| 37353-0 | XR Spine Lumbar and Sacroiliac Joint 5 Views |
| 37355-5 | XR Spine Lumbar and Sacrum 5 Views |
| 37356-3 | XR Spine Lumbar and Sacrum and Coccyx 5 Views |
| 37357-1 | XR Lumbar spine and Sacrum and SI joint and Coccyx 5 Views |
| 37361-3 | XR Cervical and thoracic spine AP and Lateral |
| 37362-1 | XR Bones Bone age Views |
| 37364-7 | RFA Aorta and Femoral artery - left Runoff W contrast IA |
| 37365-4 | XR Bones Survey Views for metastasis |
| 37379-5 | RFA Aortic arch and Upper Extremity artery Views W contrast IA |
| 37380-3 | RFA Aortic arch and Brachial artery Views W contrast IA |
| 37381-1 | RFA Carotid artery Views W contrast IA |
| 37382-9 | RFA Aortic arch and Subclavian artery Views W contrast IA |
| 37383-7 | RFA Aortic arch and Subclavian artery - left Views W contrast IA |
| 37384-5 | RFA Vertebral artery Views W contrast IA |
| 37385-2 | RFA Aortic arch and Vertebral artery - left Views W contrast IA |
| 37386-0 | RFA Aortic arch and Vertebral artery - right Views W contrast IA |
| 37387-8 | RFA Adrenal artery - left Views W contrast IA |
| 37388-6 | RFA Brachial artery - bilateral Views W contrast IA |
| 37389-4 | RFA Bronchial artery Views W contrast IA |
| 37390-2 | RFA Carotid artery.external - left Views W contrast IA |
| 37391-0 | RFA Carotid arteries and Vertebral artery Views W contrast IA |
| 37392-8 | RFA Carotid arteries and Vertebral artery - bilateral Views W contrast IA |
| 37393-6 | RFA Carotid arteries and Vertebral artery - left Views W contrast IA |
| 37394-4 | RFA Celiac artery and Superior mesenteric artery and Inferior mesenteric artery Views W contrast IA |
| 37395-1 | RFA Extremity arteries - left Views W contrast IA |
| 37396-9 | RFA Upper extremity arteries - bilateral Views W contrast IA |
| 37397-7 | RFA Gastric artery Views W contrast IA |
| 37398-5 | RFA Gastric artery - left Views W contrast IA |
| 37399-3 | RFA Gastroduodenal artery Views W contrast IA |
| 37401-7 | RFA Internal maxillary artery Views W contrast IA |
| 37402-5 | RFA Superior mesenteric artery and Inferior mesenteric artery Views W contrast IA |
| 37403-3 | RFA Celiac artery and Gastric artery - left and Superior mesenteric artery Views W contrast IA |
| 37404-1 | RFA Internal pudendal artery Views W contrast IA |
| 37405-8 | RFA Subclavian artery - bilateral Views W contrast IA |
| 37406-6 | RFA Subclavian artery - left Views W contrast IA |
| 37407-4 | RFA Vertebral artery - bilateral Views W contrast IA |
| 37409-0 | RF Temporomandibular joint - bilateral Arthrogram |
| 37410-8 | RF Temporomandibular joint - left Arthrogram |
| 37411-6 | RFA Azygos vein Views W contrast IV |
| 37412-4 | RFA Extremity veins - bilateral Views W contrast IV |
| 37413-2 | RFA Extremity veins - left Views W contrast IV |
| 37414-0 | RFA Lower extremity veins - bilateral Views W contrast IV |
| 37415-7 | RFA Upper extremity veins - bilateral Views W contrast IV |
| 37416-5 | RFA Femoral vein Views W contrast IV |
| 37419-9 | RFA Intraosseous veins Views W contrast IV |
| 37421-5 | RFA Inferior mesenteric vein Views W contrast IV |
| 37422-3 | RFA Orbit veins - left Views W contrast IV |
| 37423-1 | RFA Renal vein - left Views W contrast IV |
| 37426-4 | RFA Guidance for angioplasty of Lower extremity vein-- W contrast IV |
| 37427-2 | RF Guidance for injection of Spine |
| 37428-0 | CT Wrist |
| 37429-8 | XR tomography Wrist - bilateral |
| 37430-6 | CT Wrist - bilateral |
| 37431-4 | CT Wrist - left |
| 37432-2 | XR tomography Wrist - left |
| 37433-0 | CT Wrist - right |
| 37434-8 | MR Heart cine for function |
| 99613-2 | CT Heart WO and W contrast IV |
| 37435-5 | MR Temporomandibular joint cine |
| 37437-1 | MR Breast dynamic W contrast IV |
| 37439-7 | CT Lung parenchyma |
| 37440-5 | CT Lung parenchyma W contrast IV |
| 37441-3 | CT Lung parenchyma WO contrast |
| 37442-1 | MR spectroscopy Brain |
| 37443-9 | MR spectroscopy Unspecified body region |
| 37444-7 | MR Wrist Arthrogram |
| 37445-4 | MR Wrist - left Arthrogram |
| 37446-2 | MR Wrist - right Arthrogram |
| 37447-0 | CT Wrist W contrast IV |
| 37448-8 | MR Wrist W contrast IV |
| 37449-6 | MR Wrist - bilateral W contrast IV |
| 37450-4 | CT Wrist - left W contrast IV |
| 37451-2 | MR Wrist - left W contrast IV |
| 37452-0 | CT Wrist - right W contrast IV |
| 37453-8 | MR Wrist - right W contrast IV |
| 37454-6 | XR Wrist - bilateral 3 Views |
| 37455-3 | XR Wrist - left 3 Views |
| 37457-9 | CT Wrist WO and W contrast IV |
| 37458-7 | CT Wrist - left WO and W contrast IV |
| 37459-5 | CT Wrist WO contrast |
| 37460-3 | MR Wrist WO contrast |
| 37461-1 | CT Wrist - bilateral WO contrast |
| 37462-9 | MR Wrist - bilateral WO contrast |
| 37463-7 | CT Wrist - left WO contrast |
| 37464-5 | MR Wrist - left WO contrast |
| 37465-2 | CT Wrist - right WO contrast |
| 37466-0 | MR Wrist - right WO contrast |
| 37467-8 | XR Acromioclavicular Joint 10 degree cephalic angle |
| 37468-6 | XR Shoulder - bilateral 30 degree caudal angle |
| 37469-4 | XR Clavicle - bilateral 45 degree cephalic angle |
| 37470-2 | XR Clavicle - left 45 degree cephalic angle |
| 37471-0 | XR Hand - bilateral Bora |
| 37472-8 | XR Hand - left Bora |
| 37473-6 | XR Shoulder - left Grashey |
| 37474-4 | XR Ankle - left Lateral Views W manual stress |
| 37475-1 | XR Ankle - left Mortise W manual stress |
| 37476-9 | XR Knee PA 45 degree flexion |
| 37477-7 | XR Knee PA 45 degree flexion W standing |
| 37481-9 | XR Cervical and thoracic spine Views |
| 37482-7 | XR Wrist - bilateral 2 Views |
| 37483-5 | XR Wrist - left 2 Views |
| 37484-3 | XR Knee - left Views AP W manual stress |
| 37485-0 | XR Humerus AP and Transthoracic |
| 37486-8 | XR Ankle Broden Views W manual stress |
| 37487-6 | RFA Lower extremity arteries Views W contrast IA |
| 37488-4 | RFA Upper extremity arteries - left Views W contrast IA |
| 37489-2 | RFA Tibioperoneal arteries Views W contrast IA |
| 37490-0 | RFA Vertebral artery - left Views W contrast IA |
| 37491-8 | CT Guidance for fluid aspiration of Pleural space |
| 37492-6 | CT Guidance for biopsy of Chest Pleura |
| 37493-4 | CT Guidance for injection of Cervical spine Intervertebral disc |
| 37494-2 | RF Guidance for injection of Tendon |
| 37495-9 | CT Skull base |
| 37496-7 | CT Cervical spine W contrast intradisc |
| 37497-5 | MRA Spine vessels |
| 37498-3 | CTA Head vessels and Neck vessels W contrast IV |
| 37500-6 | MRA Spine vessels W contrast IV |
| 37501-4 | MRA Cervical spine vessels W contrast IV |
| 37502-2 | MRA Lumbar spine vessels W contrast IV |
| 37503-0 | MRA Thoracic spine vessels W contrast IV |
| 37505-5 | MRA Spine vessels WO and W contrast IV |
| 37506-3 | MRA Cervical spine vessels WO and W contrast IV |
| 37507-1 | MRA Lumbar spine vessels WO and W contrast IV |
| 37508-9 | MRA Thoracic spine vessels WO and W contrast IV |
| 37509-7 | CT Lumbar spine W contrast intradisc |
| 37510-5 | MRA Spine vessels WO contrast |
| 37511-3 | MRA Cervical spine vessels WO contrast |
| 37512-1 | MRA Thoracic spine vessels WO contrast |
| 37513-9 | XR Tibia - bilateral 10 degree caudal angle |
| 37514-7 | XR Tibia - left 10 degree caudal angle |
| 37515-4 | XR Spine lumbosacral junction Lateral spot |
| 37516-2 | XR Spine lumbosacral junction Lateral spot W standing |
| 37517-0 | XR Finger fifth - bilateral Views |
| 37518-8 | XR Finger fifth - left Views |
| 37519-6 | XR Finger fourth - bilateral Views |
| 37520-4 | XR Finger fourth - left Views |
| 37521-2 | XR Finger second - bilateral Views |
| 37522-0 | XR Finger second - left Views |
| 37523-8 | XR Finger third - bilateral Views |
| 37524-6 | XR Finger third - left Views |
| 37530-3 | XR Toe fifth - left Views |
| 37531-1 | XR Toe fourth - left Views |
| 37532-9 | XR Great toe - bilateral Views |
| 37533-7 | XR Great toe - left Views |
| 37534-5 | XR Toe second - left Views |
| 37535-2 | XR Toe third - left Views |
| 37538-6 | XR Shoulder - left Grashey and Axillary and Y |
| 37539-4 | MG Breast Grid Views |
| 37540-2 | XR Knee - bilateral Holmblad Views W standing |
| 37541-0 | XR Mastoid - bilateral Law and Mayer and Stenver and Towne |
| 37542-8 | MG Breast Magnification Views |
| 37543-6 | MG Breast - bilateral Magnification Views |
| 37544-4 | XR Wrist - bilateral Oblique Views |
| 37545-1 | XR Hip - left Oblique crosstable |
| 37546-9 | XR Temporomandibular joint - bilateral Open and Closed mouth |
| 37547-7 | XR Wrist - bilateral PA and Lateral |
| 37548-5 | XR Wrist - left PA and Lateral |
| 37549-3 | XR Wrist - bilateral PA and Lateral and Oblique |
| 37550-1 | XR Wrist - left PA and Lateral and Oblique |
| 37551-9 | MG Breast Spot Views |
| 37552-7 | MG Breast - bilateral Spot Views |
| 37553-5 | MG Breast - left Spot Views compression |
| 37554-3 | MG Breast - bilateral Magnification and Spot |
| 37555-0 | XR Wrist - left Ulnar deviation and Radial deviation |
| 37556-8 | XR Ankle Views W manual stress |
| 37557-6 | XR Ankle - bilateral Views W manual stress |
| 37558-4 | XR Ankle - left Views W manual stress |
| 37559-2 | XR Foot - left Views W manual stress |
| 37560-0 | XR Knee Views W manual stress |
| 37561-8 | XR Knee - bilateral Views W manual stress |
| 37562-6 | XR Knee - left Views W manual stress |
| 37563-4 | XR Thumb - bilateral Views W manual stress |
| 37564-2 | XR Thumb - left Views W manual stress |
| 37565-9 | RF Unspecified body region Views W barium contrast via fistula |
| 37566-7 | RF Unspecified body region Views W contrast via catheter |
| 37567-5 | RF Colon Views W contrast via colostomy |
| 37568-3 | RF Unspecified body region Views W contrast via fistula |
| 37569-1 | RF Urinary bladder Views W contrast via suprapubic tube |
| 37570-9 | RF Wrist - bilateral Arthrogram |
| 37571-7 | RF Wrist - left Arthrogram |
| 37572-5 | RF Spine Views W contrast IT |
| 37574-1 | RFA Lower extremity vessels Views W contrast IV |
| 37575-8 | XR Gallbladder Views W contrast and fatty meal PO |
| 37576-6 | RF Unspecified body region Views W gastrografin via fistula |
| 37577-4 | XR Acromioclavicular Joint Views W weight |
| 37578-2 | XR Acromioclavicular joint - bilateral Views W weight |
| 37579-0 | XR Acromioclavicular Joint Views WO and W weight |
| 37580-8 | XR Acromioclavicular joint - bilateral Views WO and W weight |
| 37581-6 | XR Acromioclavicular joint - left Views WO and W weight |
| 37582-4 | XR Acromioclavicular Joint Views WO weight |
| 37583-2 | XR Pelvis and Hip - bilateral Views and Lateral frog |
| 37584-0 | XR Great toe - left Views W standing |
| 37585-7 | RF Jejunum Views W contrast |
| 37586-5 | RF Penis Views W contrast intra corpus cavernosum |
| 37587-3 | RFA Aortic arch and Carotid artery - bilateral and Vertebral artery - bilateral Views W contrast IA |
| 37588-1 | RFA Common carotid artery - bilateral Views W contrast IA |
| 37589-9 | RFA Common carotid artery - left Views W contrast IA |
| 37590-7 | RFA Common carotid artery - right Views W contrast IA |
| 37591-5 | RFA Aortic arch and External carotid artery - bilateral Views W contrast IA |
| 37592-3 | RFA Aortic arch and External carotid artery - left Views W contrast IA |
| 37593-1 | RFA Aortic arch and External carotid artery - right Views W contrast IA |
| 37594-9 | RFA Carotid artery and Vertebral artery Views W contrast IA |
| 37595-6 | RFA Coronary arteries Views for graft W contrast IA |
| 37596-4 | RFA Abdominal and pelvic lymphatic vessels - left Views W contrast intra lymphatic |
| 37597-2 | RFA Abdominal and pelvic lymphatic vessels Views W contrast intra lymphatic |
| 37598-0 | RFA Abdominal and pelvic lymphatic vessels - bilateral Views W contrast intra lymphatic |
| 37599-8 | RFA Extremity lymphatic vessels - left Views W contrast intra lymphatic |
| 37600-4 | RFA Lymphatic vessels - left Views W contrast intra lymphatic |
| 37601-2 | RFA Pelvic lymphatic vessels - bilateral Views W contrast intra lymphatic |
| 37602-0 | RFA Adrenal vein - left Views W contrast IV |
| 37604-6 | XR Nasal bones 3 Views |
| 37605-3 | XR Nasal bones Lateral and Waters |
| 37606-1 | XR tomography Nasal bones |
| 37607-9 | XR Kidney Views W contrast IV |
| 37608-7 | US Guidance for localization of foreign body of Eye |
| 37609-5 | XR Optic foramen 4 Views |
| 37611-1 | XR tomography Orbit - bilateral |
| 37612-9 | XR Orbit - bilateral 4 Views |
| 37613-7 | XR Orbit - bilateral Waters |
| 37614-5 | XR Patella Single view |
| 37615-2 | RFA Pelvis vessels Views W contrast |
| 37616-0 | XR Pelvis Single view |
| 37617-8 | XR Pelvis 2 Views |
| 37618-6 | XR Pelvis AP and Inlet |
| 37619-4 | XR Pelvis AP and Judet |
| 37620-2 | XR Pelvis AP and Lateral |
| 37621-0 | XR Pelvis AP and Oblique |
| 37622-8 | XR Pelvis AP |
| 37623-6 | XR Pelvis AP and Inlet and Outlet |
| 37624-4 | XR Pelvis AP and Lateral and oblique |
| 37625-1 | XR Pelvis Ferguson |
| 37626-9 | XR Pelvis Lateral frog |
| 37627-7 | XR Pelvis Inlet and Outlet and Oblique |
| 37628-5 | XR Pelvis Inlet |
| 37629-3 | XR Pelvis Lateral |
| 37630-1 | XR Pelvis Oblique Views |
| 37631-9 | XR Pelvis Outlet |
| 37632-7 | XR tomography Pelvis |
| 37633-5 | XR Pelvis Single view W standing |
| 37634-3 | XR Pelvis AP 20 degree cephalic angle |
| 37635-0 | XR Acetabulum 3 Views |
| 37636-8 | XR Abdomen Views |
| 37637-6 | XR Extremity Views |
| 37639-2 | XR Neck Views |
| 37640-0 | RFA Renal vessels Views W contrast |
| 37641-8 | RF Wrist - right Arthrogram |
| 37642-6 | XR Wrist - right Limited Views |
| 37643-4 | XR Wrist - right Oblique Views |
| 37644-2 | XR tomography Wrist - right |
| 37645-9 | XR Wrist - right Ulnar deviation |
| 37646-7 | XR Sacroiliac Joint Limited Views |
| 37647-5 | RF Sacroiliac Joint Arthrogram |
| 37648-3 | XR Sacroiliac Joint 3 Views |
| 37649-1 | XR Sacroiliac Joint AP and Oblique |
| 37650-9 | XR Sacroiliac Joint Ferguson |
| 37651-7 | XR Sacrum 2 Views |
| 37652-5 | XR Sacrum AP and Lateral |
| 37653-3 | XR tomography Sacrum |
| 37654-1 | XR Scapula Single view |
| 37655-8 | XR Scapula 2 Views |
| 37656-6 | XR Scapula Y |
| 37658-2 | XR Thoracic and lumbar spine 2 Views for scoliosis |
| 37659-0 | XR Thoracic and lumbar spine AP for scoliosis W standing |
| 37660-8 | XR Thoracic and lumbar spine Lateral for scoliosis W standing |
| 37661-6 | XR Acromioclavicular joint - right 2 Views |
| 37662-4 | XR Acromioclavicular joint - right AP |
| 37663-2 | XR Acromioclavicular joint - right Views WO and W weight |
| 37664-0 | XR Acetabulum - right 2 Views |
| 37665-7 | XR Ankle - right 3 Views |
| 37666-5 | XR Ankle - right AP and Lateral and Mortise |
| 37667-3 | XR Ankle - right AP and Lateral |
| 37668-1 | XR Ankle - right AP and Lateral and oblique |
| 37669-9 | XR Ankle - right Lateral Views W manual stress |
| 37670-7 | XR Ankle - right Lateral and Mortise |
| 37671-5 | XR Ankle - right Mortise W manual stress |
| 37672-3 | XR Ankle - right 2 Views W manual stress |
| 37673-1 | XR Ankle - right Views W manual stress |
| 37674-9 | XR tomography Ankle - right |
| 37675-6 | XR Ankle - right 2 Views W standing |
| 37676-4 | XR Ankle - right Views W standing |
| 37677-2 | XR Wrist - right Carpal tunnel |
| 37678-0 | XR Wrist - right 2 Carpal tunnel Views |
| 37679-8 | XR Clavicle - right 2 Views |
| 37680-6 | XR Clavicle - right AP and Serendipity |
| 37681-4 | XR Elbow - right 2 Views |
| 37682-2 | XR Elbow - right 3 Views |
| 37683-0 | XR Elbow - right 4 Views |
| 37684-8 | XR Elbow - right AP and Lateral |
| 37685-5 | XR Elbow - right AP and Lateral and oblique |
| 37686-3 | XR Elbow - right 2 Oblique Views |
| 37687-1 | XR Elbow - right Oblique Views |
| 37688-9 | XR tomography Elbow - right |
| 37689-7 | XR Femur - right Single view |
| 37690-5 | XR Femur - right 2 Views |
| 37691-3 | XR Femur - right 4 Views |
| 37692-1 | XR Femur - right AP and Lateral |
| 37693-9 | XR Femur - right Views W standing |
| 37694-7 | XR Finger - right 2 Views |
| 37695-4 | XR Finger - right 3 Views |
| 37696-2 | XR Finger - right AP and Lateral and oblique |
| 37697-0 | XR Foot - right 2 Views |
| 37698-8 | XR Foot - right 2 Views W standing |
| 37699-6 | XR Foot - right 3 Views |
| 37700-2 | XR Foot - right 3 Views W standing |
| 37701-0 | XR Foot - right AP and Lateral |
| 37702-8 | XR Foot - right AP and Lateral and oblique |
| 37703-6 | XR Foot - right Lateral |
| 37704-4 | XR Foot - right Oblique |
| 37705-1 | XR Foot - right Views W manual stress |
| 37706-9 | XR tomography Foot - right |
| 37707-7 | XR Radius and Ulna - right 2 Views |
| 37708-5 | XR Radius and Ulna - right AP and Lateral |
| 37709-3 | XR Radius and Ulna - right Oblique Views |
| 37710-1 | XR Hand - right AP and Lateral |
| 37711-9 | XR Hand - right AP and Lateral and oblique |
| 37712-7 | XR Hand - right Lateral |
| 37713-5 | XR Hand - right PA and Lateral |
| 37714-3 | XR Hand - right PA |
| 37715-0 | XR Hand - right PA and Lateral and Oblique |
| 37716-8 | XR Hand - right Views |
| 37717-6 | XR tomography Hand - right |
| 37718-4 | XR Calcaneus - right 2 Views |
| 37719-2 | XR Calcaneus - right AP and Lateral |
| 37720-0 | XR Calcaneus - right Views W standing |
| 37721-8 | XR Hip - right 2 Views |
| 37722-6 | XR Hip - right 3 Views |
| 37723-4 | XR Hip - right AP and Lateral crosstable |
| 37724-2 | XR Hip - right AP and Lateral frog |
| 37725-9 | XR Hip - right AP and Lateral |
| 37726-7 | XR Hip - right AP |
| 37727-5 | XR Hip - right Lateral crosstable |
| 37728-3 | XR Hip - right Oblique crosstable |
| 37729-1 | XR Hip - right Lateral frog |
| 37730-9 | XR Hip - right Lateral |
| 37731-7 | XR Hip - right Single view W standing |
| 37732-5 | XR Hip - right Judet |
| 37733-3 | XR Lower extremity - right AP W standing |
| 37734-1 | XR Lower extremity - right Single view W standing |
| 37735-8 | XR tomography Hip - right |
| 37736-6 | XR Humerus - right AP and Lateral |
| 37737-4 | XR Humerus - right Oblique Views |
| 37738-2 | XR Humerus - right Views |
| 37739-0 | RFA Iliac artery - right Views W contrast IA |
| 37740-8 | XR Knee - right AP and Lateral and Sunrise and tunnel |
| 37741-6 | XR Knee - right Single view |
| 37742-4 | XR Knee - right 3 Views |
| 37743-2 | XR Knee - right 4 Views |
| 37744-0 | XR Knee - right 5 Views |
| 37745-7 | XR Knee - right AP and Lateral |
| 37746-5 | XR Knee - right Views AP W manual stress |
| 37747-3 | XR Knee - right AP and Lateral and Tunnel |
| 37748-1 | XR Knee - right AP and Lateral and oblique |
| 37749-9 | XR Knee - right AP and Lateral and Sunrise |
| 37750-7 | XR Knee - right Lateral W extension |
| 37751-5 | XR Knee - right Lateral |
| 37752-3 | XR Knee - right Rosenberg W standing |
| 37753-1 | XR Knee - right Views W manual stress |
| 37754-9 | XR Knee - right Lateral W standing |
| 37755-6 | XR Knee - right PA W standing |
| 37756-4 | XR Knee - right Tunnel W standing |
| 37757-2 | XR Knee - right Oblique Views |
| 37758-0 | XR Knee - right Views |
| 37759-8 | XR Knee - right Sunrise and Tunnel |
| 37760-6 | XR tomography Knee - right |
| 37761-4 | XR Knee - right Tunnel |
| 37762-2 | XR Knee - right 2 Views W standing |
| 37763-0 | XR Knee - right 4 Views W standing |
| 37764-8 | XR Lower extremity - right Single view |
| 37765-5 | RFA Lower extremity vessels - right Views W contrast |
| 37766-3 | XR tomography Lower extremity - right |
| 37767-1 | RFA Lower extremity veins - right Views W contrast IV |
| 37768-9 | MG Breast - right 2 Views |
| 37769-7 | MG Breast - right Magnification and Spot |
| 37770-5 | MG Breast - right Tangential |
| 37771-3 | MG Breast - right True lateral |
| 37772-1 | MG Breast - right XCCL |
| 37773-9 | MG Breast - right Magnification |
| 37774-7 | MG Breast - right Views |
| 37775-4 | MG Breast - right Rolled Views |
| 37776-2 | XR Patella - right AP and Lateral |
| 37777-0 | XR Patella - right Views |
| 37778-8 | RFA Popliteal artery - right Views W contrast IA |
| 37779-6 | RFA Right pulmonary arteries Views W contrast IA |
| 37780-4 | XR Ribs - right 2 Views |
| 37781-2 | XR Ribs - right 3 Views |
| 37782-0 | XR Ribs - right Anterior and Lateral |
| 37783-8 | XR Ribs - right AP |
| 37784-6 | XR Ribs - right Lateral |
| 37785-3 | RF Sacroiliac joint - right Arthrogram |
| 37786-1 | XR Sacroiliac joint - right Views |
| 37787-9 | XR Scapula - right 2 Views |
| 37788-7 | XR Scapula - right AP and Lateral |
| 37789-5 | XR Scapula - right AP and Y |
| 37790-3 | XR Scapula - right Y |
| 37791-1 | XR Shoulder - right Stryker Notch |
| 37792-9 | XR Shoulder - right Single view |
| 37793-7 | XR Shoulder - right 2 Views |
| 37794-5 | XR Shoulder - right 4 Views |
| 37795-2 | XR Shoulder - right 5 Views |
| 37796-0 | XR Shoulder - right 6 Views |
| 37797-8 | XR Shoulder - right AP and Stryker Notch |
| 37798-6 | XR Shoulder - right AP |
| 37799-4 | XR Shoulder - right AP and West Point and Outlet |
| 37800-0 | XR Shoulder - right Axillary |
| 37801-8 | XR Shoulder - right Garth |
| 37802-6 | XR Shoulder - right Outlet |
| 37803-4 | XR Shoulder - right Lateral and Y |
| 37804-2 | XR Shoulder - right Outlet and Y |
| 37805-9 | XR Shoulder - right Y |
| 37806-7 | XR Shoulder - right Grashey and Axillary and Outlet |
| 37807-5 | XR Shoulder - right Axillary and Y |
| 37808-3 | XR Sternoclavicular joint - right Serendipity |
| 37809-1 | XR Shoulder - right West Point |
| 37810-9 | XR Acromioclavicular joint - right Zanca |
| 37811-7 | XR tomography Shoulder - right |
| 37812-5 | XR Thumb - right 3 Views |
| 37813-3 | XR Thumb - right AP and Lateral and oblique |
| 37814-1 | XR Thumb - right Views W manual stress |
| 37815-8 | XR Tibia and Fibula - right 2 Views |
| 37816-6 | XR Tibia and Fibula - right AP and Lateral |
| 37817-4 | XR Tibia and Fibula - right Oblique Views |
| 37818-2 | RF Temporomandibular joint - right Arthrogram |
| 37819-0 | XR tomography Temporomandibular joint - right |
| 37820-8 | XR Toes - right 3 Views |
| 37821-6 | XR Toes - right 2 Views |
| 37822-4 | XR Toes - right AP and Lateral |
| 37823-2 | XR Toes - right Views W standing |
| 37824-0 | RFA Upper extremity veins - right Views W contrast IV |
| 37825-7 | XR Wrist - right Single view |
| 37826-5 | XR Wrist - right 2 Views |
| 37827-3 | XR Wrist - right 3 Views |
| 37828-1 | XR Wrist - right 4 Views |
| 37829-9 | XR Wrist - right 5 Views |
| 37830-7 | XR Wrist - right 6 Views |
| 37831-5 | XR Wrist - right 8 Views |
| 37832-3 | XR Wrist - right AP and Lateral |
| 37833-1 | XR Wrist - right Lateral W extension |
| 37834-9 | XR Wrist - right Lateral W flexion |
| 37835-6 | XR Wrist - right PA and Lateral |
| 37836-4 | XR Wrist - right PA and Lateral and Oblique |
| 37839-8 | XR Shoulder AP and Lateral and Axillary |
| 37840-6 | XR Shoulder 2 Views |
| 37841-4 | XR Shoulder AP and Lateral |
| 37842-2 | XR Shoulder AP |
| 37843-0 | XR Shoulder Garth |
| 37844-8 | XR Shoulder Grashey |
| 37845-5 | XR Shoulder Outlet |
| 37846-3 | XR Sternoclavicular Joint Serendipity |
| 37847-1 | XR Shoulder Y |
| 37848-9 | XR Acromioclavicular Joint Zanca |
| 37849-7 | XR Shoulder Axillary |
| 37850-5 | XR tomography Shoulder |
| 37851-3 | XR Sinuses Single view |
| 37852-1 | XR Sinuses Caldwell and Waters |
| 37853-9 | XR Sinuses 2 Views |
| 37854-7 | XR Sinuses 3 Views |
| 37855-4 | XR Sinuses 4 Views |
| 37856-2 | XR Sinuses 5 Views |
| 37857-0 | XR Sinuses Caldwell |
| 37858-8 | XR Sinuses Lateral |
| 37859-6 | XR Sinuses PA and Lateral and Waters |
| 37860-4 | XR Sinuses PA and Lateral and Caldwell and Waters |
| 37861-2 | XR Sinuses Submentovertex |
| 37862-0 | XR Sinuses Lateral and Waters |
| 37863-8 | XR Sinuses Waters |
| 37864-6 | XR Sinuses Lateral and Caldwell and Waters |
| 37866-1 | XR tomography Sinuses |
| 37867-9 | XR Skull 2 Views |
| 37868-7 | XR Skull 4 Views |
| 37869-5 | XR Skull Lateral and Towne |
| 37870-3 | XR Skull Towne |
| 37871-1 | XR Skull Lateral and Caldwell and Waters and Towne |
| 37872-9 | XR Skull Lateral crosstable |
| 37874-5 | XR tomography Skull |
| 37875-2 | XR Spine Single view |
| 37876-0 | XR Spine 4 Views |
| 37877-8 | XR Spine AP |
| 37878-6 | XR Spine Lateral crosstable |
| 37879-4 | XR Spine 2 Views |
| 37880-2 | XR Sternoclavicular Joint AP |
| 37881-0 | XR Sternoclavicular Joint 3 Views |
| 37882-8 | XR Sternoclavicular Joint 4 Views |
| 37883-6 | XR Sternum 2 Views |
| 37884-4 | XR Sternum PA and Lateral and Oblique |
| 37885-1 | XR tomography Sternum |
| 37886-9 | RFA Subclavian artery Views W contrast IA |
| 37887-7 | RF Guidance for fluid aspiration of Pleural space |
| 37888-5 | XR Thumb 3 Views |
| 37889-3 | XR Thumb AP and Lateral |
| 37890-1 | XR Thumb AP |
| 37891-9 | XR Thumb Lateral |
| 37892-7 | XR Thumb Oblique |
| 37893-5 | XR Tibia and Fibula Lateral |
| 37894-3 | XR Tibia and Fibula Single view |
| 37895-0 | XR Tibia and Fibula 2 Views |
| 37896-8 | XR Tibia and Fibula AP and Lateral |
| 37897-6 | XR Tibia and Fibula AP |
| 37898-4 | XR tomography Tibia and Fibula |
| 37899-2 | XR Tibia and Fibula Views W standing |
| 37901-6 | RF Temporomandibular joint Arthrogram |
| 37902-4 | XR Toes 2 Views |
| 37903-2 | XR Thoracic spine Lateral crosstable |
| 37904-0 | XR Thoracic spine Single view |
| 37905-7 | XR Thoracic spine 2 Views |
| 37906-5 | XR Thoracic spine 3 Views |
| 37907-3 | XR Thoracic spine 4 Views |
| 37908-1 | XR Thoracic spine AP and Lateral and oblique |
| 37909-9 | XR Thoracic spine Lateral W hyperextension |
| 37910-7 | XR Thoracic spine Lateral W standing |
| 37911-5 | XR tomography Thoracic spine |
| 37912-3 | US Guidance for biopsy of Breast - bilateral |
| 37913-1 | US Guidance for biopsy of Abdomen |
| 37914-9 | US Guidance for biopsy of Breast |
| 37915-6 | US Guidance for biopsy of Chest |
| 37917-2 | US Guidance for percutaneous biopsy of Muscle |
| 37918-0 | US Guidance for biopsy of Neck |
| 37919-8 | US Guidance for biopsy of Pancreas |
| 37920-6 | US Guidance for biopsy of Salivary gland |
| 37921-4 | US Guidance for needle localization of Chest |
| 37922-2 | XR Upper extremity 2 Views |
| 37923-0 | XR tomography Upper extremity |
| 37924-8 | XR Wrist Single view |
| 37925-5 | XR Wrist 2 Views |
| 37926-3 | XR Wrist 3 Views |
| 37927-1 | XR Wrist AP and Lateral and oblique |
| 37928-9 | XR Wrist Brewerton |
| 37929-7 | XR Wrist Lateral Views W flexion and W extension |
| 37930-5 | XR Wrist Lateral |
| 37931-3 | XR Wrist PA |
| 37932-1 | XR tomography Wrist |
| 37933-9 | XR Zygomatic arch 3 Views |
| 37934-7 | XR Zygomatic arch 4 Views |
| 37935-4 | RFA Pelvis arteries and Lower extremity arteries - bilateral Views W contrast IA |
| 37936-2 | RFA Peripheral vessels Views W contrast |
| 37937-0 | XR Ribs anterior Views |
| 37938-8 | XR Ribs posterior Views |
| 37939-6 | RFA Adrenal artery - right Views W contrast IA |
| 37940-4 | RFA Adrenal vein - right Views W contrast IV |
| 37941-2 | RFA Ankle arteries - right Views W contrast IA |
| 37942-0 | RF Ankle - right Arthrogram |
| 37943-8 | RFA Carotid arteries and Vertebral artery - right Views W contrast IA |
| 37944-6 | RFA Carotid artery and Cerebral artery - right Views W contrast IA |
| 37945-3 | RFA Carotid artery.cervical - right Views W contrast IA |
| 37947-9 | RF Elbow - right Arthrogram |
| 37948-7 | RFA Carotid artery.external - right Views W contrast IA |
| 37949-5 | RFA Extremity arteries - right Views W contrast IA |
| 37950-3 | RFA Extremity veins - right Views W contrast IV |
| 37952-9 | RFA Carotid artery.internal - right Views W contrast IA |
| 37953-7 | RFA Carotid artery and Cerebral artery internal - right Views W contrast IA |
| 37958-6 | RFA Orbit veins - right Views W contrast IV |
| 37959-4 | RFA Renal vein - right Views W contrast IV |
| 37960-2 | XR Ribs lower - right Views |
| 37961-0 | XR Ribs upper - right Views |
| 37962-8 | XR Ribs anterior and posterior - right Views |
| 37963-6 | XR Ribs anterior - right Views |
| 37964-4 | XR Ribs posterior - right Views |
| 37965-1 | XR Sternoclavicular joint - right Views |
| 37966-9 | RFA Subclavian artery - right Views W contrast IA |
| 37967-7 | RFA Upper extremity arteries - right Views W contrast IA |
| 37968-5 | RFA Vertebral artery - right Views W contrast IA |
| 37969-3 | RFA Sinus vein Views W contrast IV |
| 37970-1 | RFA Splenic vein Views W contrast IV |
| 37971-9 | RFA Subclavian vein Views W contrast IV |
| 37972-7 | RFA Superior mesenteric vein Views W contrast IV |
| 37973-5 | RF Testicular vessels Views W contrast |
| 37974-3 | XR Spine thoracolumbar junction AP and Lateral |
| 37975-0 | XR Spine thoracolumbar junction Views |
| 37976-8 | RFA Upper extremity vessels Views W contrast |
| 37977-6 | RFA Upper extremity arteries Views W contrast IA |
| 37979-2 | RFA Uterine artery Views W contrast IA |
| 37980-0 | RFA Vertebral vessels Views W contrast |
| 37981-8 | RFA Visceral vessels Views W contrast |
| 37994-1 | MRA Lumbar spine vessels WO contrast |
| 37995-8 | XR Calcaneus - bilateral Broden Views |
| 37996-6 | XR Calcaneus Broden Views |
| 37997-4 | XR Calcaneus - left Broden Views |
| 37998-2 | XR Elbow Radial head capitellar |
| 37999-0 | XR Elbow - bilateral Radial head capitellar |
| 38000-6 | XR Elbow - left Radial head capitellar |
| 38001-4 | XR Chest Single view W expiration |
| 38002-2 | XR Chest Single view W inspiration |
| 38003-0 | XR Foot - left Views AP W standing |
| 38004-8 | XR Shoulder - left Grashey Views WO and W weight |
| 38006-3 | XR Elbow - right Radial head capitellar |
| 38007-1 | XR Humerus - right Transthoracic |
| 38008-9 | XR Cervical and thoracic and lumbar spine Views |
| 38009-7 | XR Thoracic spine AP and Lateral and Swimmers |
| 38010-5 | XR Thoracic spine Lateral Views W flexion and W extension |
| 38011-3 | US Thoracic and abdominal aorta limited |
| 38012-1 | US Guidance for aspiration of cyst of Breast - bilateral |
| 38013-9 | US Lower extremity - bilateral |
| 38014-7 | US Upper extremity artery - bilateral |
| 38015-4 | US Carotid arteries limited |
| 38016-2 | US Chest wall |
| 38017-0 | US Guidance for FNA of Prostate |
| 38018-8 | US Guidance for fine needle aspiration of Unspecified body region |
| 38019-6 | US Guidance for fine needle aspiration of Thyroid gland |
| 38020-4 | US Gallbladder limited |
| 38021-2 | US Biliary ducts and Gallbladder |
| 38022-0 | US Gallbladder W cholecystokinin |
| 38023-8 | US Guidance for percutaneous biopsy.core needle of Breast - left |
| 38024-6 | US Guidance for core needle biopsy of Unspecified body region |
| 38025-3 | US Guidance for percutaneous biopsy.core needle of Breast - right |
| 38026-1 | US Guidance for fine needle aspiration of Breast - left |
| 38030-3 | US Guidance for biopsy of Spleen |
| 38032-9 | US Guidance for needle localization of Unspecified body region |
| 38033-7 | US Guidance for fine needle aspiration of Breast - right |
| 38034-5 | US Head limited |
| 38035-2 | US Kidney limited |
| 38036-0 | US Kidney |
| 38037-8 | US Femur - left |
| 38038-6 | US Kidney - left |
| 38039-4 | US Lower extremity - left limited |
| 38040-2 | US Lower extremity - left |
| 38041-0 | US Upper extremity - left |
| 38042-8 | US.doppler Lower extremity artery limited |
| 38043-6 | US Mastoid |
| 38044-4 | US Mediastinum |
| 38045-1 | US Parathyroid gland |
| 38046-9 | US Pelvis limited |
| 38047-7 | US Retroperitoneum limited |
| 38048-5 | US Femur - right |
| 38049-3 | US Kidney - right |
| 38050-1 | US Lower extremity - right limited |
| 38051-9 | US Lower extremity - right |
| 38052-7 | US Upper extremity - right |
| 38053-5 | US Sacrum |
| 38054-3 | US Visceral artery |
| 38057-6 | MR Breast - left for implant |
| 38058-4 | MR Breast - right for implant |
| 38061-8 | MR Spine Cervical and Spine Thoracic and Spine Lumbar and Sacrum W contrast IV |
| 38062-6 | MR Breast - right for implant WO and W contrast IV |
| 38064-2 | MR Breast - left for implant WO contrast |
| 38065-9 | XR Hip - left Single view during surgery |
| 38066-7 | XR Hip - left Lateral during surgery |
| 38068-3 | XR Chest Right anterior oblique |
| 38069-1 | XR Abdomen Left posterior oblique |
| 38070-9 | MG Breast Views for implant |
| 38071-7 | MG Breast - bilateral Views for implant |
| 38072-5 | MG Breast - left Views for implant |
| 38073-3 | XR Ribs anterior - bilateral Views |
| 38074-1 | XR Ribs anterior - left Views |
| 38079-0 | MG Breast specimen - bilateral Views |
| 38080-8 | MG Breast specimen - left Views |
| 38082-4 | XR Shoulder - left AP and Transthoracic |
| 38083-2 | XR Cervical spine AP and Lateral and Oblique and Odontoid and Swimmers |
| 38084-0 | XR Abdomen AP and Left posterior oblique |
| 38086-5 | XR Knee Merchants 30 and 45 and 60 degrees |
| 38087-3 | XR Knee - left Sunrise 20 and 40 and 60 degrees |
| 38088-1 | XR Knee - bilateral Sunrise 20 and 40 and 60 degrees |
| 38089-9 | XR Bones Limited Survey Views for metastasis |
| 38090-7 | MG Breast - bilateral Air gap Views |
| 38091-5 | MG Breast - left Air gap Views |
| 38092-3 | RF Urinary bladder Views W chain and contrast intra bladder |
| 38093-1 | XR Chest Views W nipple markers |
| 38094-9 | RF Spinal cavity Views W contrast |
| 38095-6 | MG Breast duct - bilateral Views W contrast intra duct |
| 38096-4 | MG Breast duct - left Views W contrast intra duct |
| 38097-2 | RF Parotid gland - left Views W contrast intra salivary duct |
| 38098-0 | RF Lacrimal duct - bilateral Views W contrast intra lacrimal duct |
| 38099-8 | RF Lacrimal duct - left Views W contrast intra lacrimal duct |
| 38100-4 | RF Urinary bladder and Urethra Views W contrast antegrade |
| 38101-2 | XR Kidney Views W contrast antegrade |
| 38102-0 | XR Kidney Views W contrast antegrade via pyelostomy |
| 38103-8 | RF Spine Cervical and Spine Lumbar Views W contrast IT |
| 38104-6 | RF Spine epidural space Views W contrast IT |
| 38105-3 | XR Kidney Views W contrast retrograde |
| 38107-9 | XR Wrist Scaphoid Views |
| 38108-7 | XR Knee - right 2 Oblique Views |
| 38112-9 | RF Kidney - right Views W contrast via nephrostomy tube |
| 38114-5 | XR Tibia and Fibula - right 2 Oblique Views |
| 38115-2 | XR Wrist - right Scaphoid Views |
| 38116-0 | RF Parotid gland Views W contrast intra salivary duct |
| 38117-8 | XR Sinuses Waters upright |
| 38118-6 | XR Neck 2 Lateral Views |
| 38119-4 | RFA Thoracic artery Views W contrast IA |
| 38120-2 | RF Thoracic spine Limited Views W contrast IT |
| 38121-0 | XR Thoracic and lumbar spine Single view |
| 38123-6 | XR Thoracic and lumbar spine AP and Lateral |
| 38124-4 | XR Thoracic and lumbar spine Views W standing |
| 38125-1 | RF Cervical and thoracic and lumbar spine Limited Views W contrast IT |
| 38126-9 | US Guidance for aspiration of cyst of Kidney |
| 38127-7 | US Guidance for aspiration of CSF of Spine |
| 38128-5 | US Femoral vessels - bilateral |
| 38129-3 | US Iliac vessels - bilateral |
| 38130-1 | US Lower extremity artery - bilateral |
| 38131-9 | US Subclavian vessels - bilateral |
| 38132-7 | US Guidance for biopsy of Scrotum and testicle |
| 38133-5 | US Guidance for aspiration of cyst of Pancreas |
| 38134-3 | US Femoral vessels |
| 38135-0 | US Guidance for deep aspiration.fine needle of Tissue |
| 38136-8 | US Guidance for superficial aspiration.fine needle of Tissue |
| 38137-6 | US Iliac vessels - left |
| 38138-4 | US Parotid gland |
| 38139-2 | US Penis vessels |
| 38140-0 | US Penis |
| 38141-8 | US Iliac vessels - right |
| 38142-6 | US Guidance for drainage and placement of drainage catheter of Chest |
| 38143-4 | US.doppler Upper extremity artery limited |
| 38144-2 | XR Finger second - right Views |
| 38145-9 | XR Finger third - right Views |
| 38146-7 | XR Finger fourth - right Views |
| 38147-5 | XR Finger fifth - right Views |
| 38148-3 | XR Toe second - right Views |
| 38149-1 | XR Toe third - right Views |
| 38150-9 | XR Toe fourth - right Views |
| 38151-7 | XR Toe fifth - right Views |
| 38152-5 | XR Great toe - right Views |
| 38153-3 | RF Submandibular gland Views W contrast intra salivary duct |
| 38154-1 | RF Guidance for superficial biopsy of Bone |
| 38155-8 | XR Wrist 4 Views |
| 38156-6 | XR Wrist 6 Views |
| 38268-9 | DXA Skeletal system Views for bone density |
| 38765-4 | US Guidance for biopsy of transplanted liver |
| 38766-2 | US Guidance for biopsy of transplanted kidney |
| 38767-0 | CT Internal auditory canal - right |
| 38768-8 | XR tomography Femur - right |
| 38769-6 | MR Lower extremity joint - right limited WO contrast |
| 38770-4 | MR Scapula - right WO contrast |
| 38771-2 | XR Pelvis and Hip - right Views |
| 38772-0 | XR Hip - right True lateral |
| 38773-8 | MRA Lower extremity vessels - right WO contrast |
| 38774-6 | XR Orbit - right Views |
| 38775-3 | XR Hand - right Brewerton |
| 38776-1 | XR Calcaneus - right Harris |
| 38777-9 | XR Elbow - right Jones |
| 38778-7 | XR Calcaneus - right Ski jump Views |
| 38779-5 | XR Shoulder - right Transthoracic |
| 38780-3 | XR Shoulder - right Velpeau axillary |
| 38781-1 | XR Shoulder - right AP and Axillary and Outlet |
| 38782-9 | XR Shoulder - right AP and Axillary and Outlet and Zanca |
| 38783-7 | XR Shoulder - right AP and Axillary and Y |
| 38784-5 | XR Pelvis and Hip - right AP and Lateral crosstable |
| 38785-2 | XR Pelvis and Hip - right AP and Lateral frog |
| 38786-0 | XR Patella - right AP and Lateral and Sunrise |
| 38787-8 | XR Shoulder - right AP and West Point |
| 38788-6 | XR Shoulder - right AP and Y |
| 38789-4 | XR Shoulder - right Grashey and Axillary and Y |
| 38790-2 | XR Patella - right PA and Lateral and Sunrise |
| 38791-0 | XR Shoulder - right Grashey and Outlet |
| 38793-6 | XR Shoulder - right Grashey and Axillary |
| 38794-4 | XR Shoulder - right Grashey and Outlet and Serendipity |
| 38795-1 | XR Shoulder - right Grashey and West Point |
| 38796-9 | Portable XR Hip - right Views |
| 38797-7 | XR Humerus bicipital groove - right Views |
| 38798-5 | XR Olecranon - right Views |
| 38799-3 | RFA Aorta and Femoral artery - right Runoff W contrast IA |
| 38800-9 | RFA Aortic arch and Subclavian artery - right Views W contrast IA |
| 38801-7 | RFA Gastric artery right Views W contrast IA |
| 38802-5 | CT Wrist - right WO and W contrast IV |
| 38803-3 | XR Clavicle - right 45 degree cephalic angle |
| 38804-1 | XR Hand - right Bora |
| 38805-8 | XR Shoulder - right Grashey |
| 38806-6 | XR Tibia - right 10 degree caudal angle |
| 38807-4 | MG Breast - right Spot Views |
| 38808-2 | XR Wrist - right Ulnar deviation and Radial deviation |
| 38810-8 | XR Great toe - right Views W standing |
| 38811-6 | RFA Abdominal and pelvic lymphatic vessels - right Views W contrast intra lymphatic |
| 38812-4 | RFA Extremity lymphatic vessels - right Views W contrast intra lymphatic |
| 38813-2 | RFA Lymphatic vessels - right Views W contrast intra lymphatic |
| 38814-0 | XR Calcaneus - right Broden Views |
| 38815-7 | XR Foot - right Views AP W standing |
| 38816-5 | XR Shoulder - right Grashey Views WO and W weight |
| 38817-3 | MR Breast - right for implant WO contrast |
| 38818-1 | XR Hip - right Single view during surgery |
| 38819-9 | XR Hip - right Lateral during surgery |
| 38820-7 | MG Breast - right Views for implant |
| 38821-5 | MG Breast specimen - right Views |
| 38822-3 | XR Shoulder - right AP and Transthoracic |
| 38824-9 | XR Knee - right Sunrise 20 and 40 and 60 degrees |
| 38825-6 | MG Breast duct - right Views W contrast intra duct |
| 38826-4 | RF Parotid gland - right Views W contrast intra salivary duct |
| 38827-2 | RF Lacrimal duct - right Views W contrast intra lacrimal duct |
| 38828-0 | CT Shoulder - left Arthrogram |
| 38829-8 | MR Upper extremity - left W contrast IV |
| 38830-6 | MR Shoulder - left W contrast IV |
| 38831-4 | MR Upper extremity - left WO and W contrast IV |
| 38832-2 | MR Upper extremity - left WO contrast |
| 38833-0 | MR Brachial plexus - left WO contrast |
| 38834-8 | MR Shoulder - left WO contrast |
| 38835-5 | CT Temporal bone - left W contrast IV |
| 38836-3 | MR Orbit - left |
| 38837-1 | MRA Knee vessels - left WO and W contrast IV |
| 38838-9 | XR Wrist - left Limited Views |
| 38839-7 | XR Wrist - left Oblique Views |
| 38840-5 | XR Ankle - left 2 Views W manual stress |
| 38841-3 | XR Ankle - left 2 Views W standing |
| 38842-1 | XR Wrist - left Carpal tunnel |
| 38843-9 | XR Wrist - left 2 Carpal tunnel Views |
| 38844-7 | XR Elbow - left 2 Oblique Views |
| 38845-4 | XR Femur - left Views W standing |
| 38846-2 | XR Foot - left 2 Views |
| 38847-0 | XR Hand - left AP and Lateral |
| 38848-8 | XR Hand - left AP and Lateral and oblique |
| 38849-6 | XR Lower extremity - left AP W standing |
| 38850-4 | XR Lower extremity - left Single view W standing |
| 38851-2 | XR Knee - left 2 Views W standing |
| 38852-0 | XR Knee - left 4 Views W standing |
| 38853-8 | RFA Lower extremity vessels - left Views W contrast |
| 38854-6 | MG Breast - left Magnification and Spot |
| 38855-3 | MG Breast - left True lateral |
| 38856-1 | XR Ribs - left Anterior and Lateral |
| 38857-9 | XR Ribs - left Lateral |
| 38858-7 | XR Shoulder - left Y |
| 38859-5 | RFA Upper extremity veins - left Views W contrast IV |
| 38860-3 | XR Wrist - left AP and Lateral |
| 38861-1 | RFA Ankle arteries - left Views W contrast IA |
| 38862-9 | RFA Carotid artery and Cerebral artery - left Views W contrast IA |
| 38863-7 | RFA Carotid artery.cervical - left Views W contrast IA |
| 38864-5 | RFA Carotid artery.internal - left Views W contrast IA |
| 38865-2 | RFA Carotid artery and Cerebral artery internal - left Views W contrast IA |
| 38866-0 | XR Ribs lower - left Views |
| 38867-8 | XR Ribs upper - left Views |
| 38868-6 | XR Ribs anterior and posterior - left Views |
| 38869-4 | XR Ribs posterior - left Views |
| 38870-2 | MR Breast - left for implant WO and W contrast IV |
| 38871-0 | XR Knee - left 2 Oblique Views |
| 38872-8 | RF Kidney - left Views W contrast via nephrostomy tube |
| 38874-4 | XR Tibia and Fibula - left 2 Oblique Views |
| 39026-0 | CT Guidance for needle localization of Unspecified body region |
| 39027-8 | RF Guidance for needle localization of Unspecified body region |
| 39028-6 | MR Guidance for needle localization of Unspecified body region |
| 39029-4 | MR Orbit and Face WO and W contrast IV |
| 39030-2 | US Vein - bilateral |
| 39031-0 | US.doppler Extremity artery - bilateral |
| 39032-8 | US for transplanted kidney |
| 39033-6 | MR Upper extremity WO contrast |
| 39034-4 | MR Upper extremity WO and W contrast IV |
| 39036-9 | US Vein |
| 39037-7 | MR Upper extremity W contrast IV |
| 39038-5 | MR Orbit and Face W contrast IV |
| 39039-3 | US.doppler Brachiocephalic artery |
| 39040-1 | US AV fistula |
| 39042-7 | US.doppler Extremity artery |
| 39044-3 | US.doppler Head vessels limited |
| 39045-0 | US Vein limited |
| 39046-8 | CT Pelvis limited for pelvimetry WO contrast |
| 39047-6 | RF Hip Single view during surgery |
| 39048-4 | XR Scapula AP |
| 39049-2 | XR Thoracic and lumbar spine AP |
| 39050-0 | XR Ribs AP |
| 39051-8 | XR Chest Lateral |
| 39052-6 | XR Spine Lateral |
| 39053-4 | XR Ribs Lateral |
| 39054-2 | MG Breast duct Views W contrast intra duct |
| 39055-9 | RFA Extremity veins Views W contrast IV |
| 39056-7 | XR Unspecified body region Views W manual stress |
| 39057-5 | RFA Pulmonary arteries Views W contrast IA |
| 39058-3 | XR Salivary gland Views |
| 39060-9 | XR Ribs 2 Views |
| 39061-7 | XR Sacrum and Coccyx 3 Views |
| 39062-5 | XR Ribs 3 Views |
| 39063-3 | XR Lumbar spine 5 Views W flexion and W extension |
| 39064-1 | XR Ribs Anterior and Lateral |
| 39065-8 | XR Pelvis AP and Inlet and Outlet and Oblique |
| 39066-6 | XR and RF Chest AP and Lateral and Views |
| 39067-4 | XR Cervical and thoracic and lumbar spine AP and Lateral |
| 39068-2 | XR Foot AP and Lateral W standing |
| 39069-0 | XR Foot AP and Lateral |
| 39070-8 | XR Chest AP and Lateral and Apical lordotic |
| 39071-6 | XR Knee AP and Lateral and Merchants |
| 39072-4 | XR Ankle AP and Lateral and oblique |
| 39073-2 | XR Knee AP and Lateral and Right oblique and Left oblique |
| 39074-0 | XR Chest AP and Lateral and Right oblique and Left oblique |
| 39075-7 | XR Toes AP and Oblique |
| 39076-5 | XR Foot AP and Oblique |
| 39077-3 | XR Shoulder AP and Transthoracic |
| 39078-1 | XR Finger PA and Lateral and Oblique |
| 39079-9 | XR Hand PA and Oblique |
| 39093-0 | RFA Hepatic veins Views W contrast IV |
| 39094-8 | RFA Carotid artery.cervical Views W contrast IA |
| 39095-5 | RFA Carotid artery and Cerebral artery Views W contrast IA |
| 39096-3 | RFA Hepatic veins Views for hemodynamics W contrast IV |
| 39097-1 | RFA Carotid artery - bilateral and Cerebral artery - bilateral Views W contrast IA |
| 39098-9 | RFA Carotid artery.cervical.bilateral Views W contrast IA |
| 39099-7 | XR Ribs - bilateral 4 Views and Chest PA |
| 39138-3 | RFA Guidance for vascular access of Vessel |
| 39139-1 | US Guidance for vascular access of Unspecified body region |
| 39140-9 | MR Heart cine for blood flow velocity mapping |
| 99612-4 | CT Heart WO contrast |
| 39141-7 | MR Bone marrow |
| 39142-5 | CT perfusion Head W contrast IV |
| 39144-1 | RF Gastrointestinal tract upper Single view W air contrast PO |
| 39145-8 | MG Breast duct - left Views W contrast intra multiple ducts |
| 39146-6 | MG Breast duct - bilateral Views W contrast intra multiple ducts |
| 39147-4 | MG Breast duct - right Views W contrast intra multiple ducts |
| 39148-2 | MG Breast duct Views W contrast intra multiple ducts |
| 39149-0 | XR Gastrointestinal tract and Pulmonary system Single view for foreign body |
| 39150-8 | FFD mammogram Breast Views Post Localization |
| 39151-6 | RF Vas deferens Views W contrast intra vas deferens |
| 39152-4 | FFD mammogram Breast Diagnostic |
| 39153-2 | FFD mammogram Breast Screening |
| 39154-0 | FFD mammogram Breast - bilateral Diagnostic |
| 39291-0 | MR Lower extremity WO and W contrast IV |
| 39292-8 | MR Lower extremity WO contrast |
| 39293-6 | MR Lower extremity W contrast IV |
| 39321-5 | XR Shoulder AP internal rotation and AP external rotation and Axillary |
| 39322-3 | CT Spine W contrast intradisc |
| 39323-1 | XR Abdomen Right posterior oblique |
| 39324-9 | XR Wrist - left PA W clenched fist |
| 39325-6 | XR Shoulder - left AP internal rotation and Grashey and Axillary and Outlet |
| 39326-4 | XR Ribs - left and Chest Views |
| 39327-2 | XR Abdomen and Fetal Views for fetal age |
| 39328-0 | XR Shoulder - left AP internal rotation and AP external rotation |
| 39329-8 | XR Shoulder - bilateral AP internal rotation and AP external rotation |
| 39330-6 | XR Ankle - bilateral AP and Lateral W standing |
| 39331-4 | XR Foot - bilateral AP and Lateral W standing |
| 39332-2 | XR Foot - left AP and Lateral W standing |
| 39333-0 | XR Lumbar spine AP and Lateral W standing |
| 39334-8 | XR Foot - left AP and Lateral and oblique W standing |
| 39335-5 | XR Shoulder - left AP internal rotation and AP external rotation and Axillary |
| 39336-3 | XR Shoulder - bilateral AP internal rotation and AP external rotation and Axillary |
| 39337-1 | XR Shoulder - bilateral AP internal rotation and AP external rotation and Axillary and Outlet |
| 39338-9 | XR Shoulder - left AP internal rotation and AP external rotation and Axillary and Y |
| 39339-7 | XR Shoulder - bilateral AP and Axillary and Outlet and 30 degree caudal angle |
| 39340-5 | XR Lumbar spine Lateral Views W standing and W flexion and W extension |
| 39341-3 | XR Chest Lateral and PA W inspiration and expiration |
| 39343-9 | XR Shoulder - bilateral AP internal rotation and AP external rotation and Y |
| 39344-7 | XR Shoulder - bilateral AP internal rotation and AP external rotation and Axillary and Y |
| 39345-4 | XR Knee - left Sunrise and (Tunnel W standing) |
| 39346-2 | XR Shoulder - bilateral AP internal rotation and West Point |
| 39347-0 | XR Shoulder - left AP internal rotation and West Point |
| 39348-8 | XR Shoulder - left AP internal rotation and AP external rotation and Y |
| 39349-6 | RF Kidney - bilateral Views W contrast retrograde |
| 39350-4 | XR Shoulder - bilateral Grashey and Outlet and Serendipity |
| 39351-2 | XR Ribs upper anterior and posterior - left Views |
| 39352-0 | XR Ribs posterior - bilateral Views |
| 39353-8 | XR Ribs upper posterior - left Views |
| 39359-5 | XR tomography Kidney - bilateral WO contrast |
| 39360-3 | XR Pelvis Views and Inlet and Outlet |
| 39361-1 | RF Guidance for drainage of abscess and placement of drainage catheter of Liver |
| 39362-9 | RF Guidance for placement of tube in Chest |
| 39363-7 | RFA AV fistula Views W contrast retrograde |
| 39364-5 | XR Wrist - right 3 Views and Radial deviation |
| 39365-2 | XR Wrist - right 3 Views and Ulnar deviation |
| 39366-0 | XR Scapula Lateral and outlet |
| 39367-8 | XR Thoracic and lumbar spine AP and lateral for scoliosis W standing |
| 39368-6 | XR Ankle - right AP and Lateral W standing |
| 39369-4 | XR Ankle - right AP and Lateral and Oblique and (View W manual stress) |
| 39370-2 | XR Ankle - right Views and (View W manual stress) |
| 39371-0 | XR Ankle - right AP and Lateral and oblique W standing |
| 39372-8 | XR Ankle - right Views and Mortise |
| 39373-6 | XR Elbow - right Views and Oblique |
| 39374-4 | XR Foot - right AP and Lateral W standing |
| 39375-1 | XR Foot - right AP and Lateral and oblique W standing |
| 39376-9 | XR Radius and Ulna - right Views and Oblique |
| 39377-7 | XR Hip - right Views and Lateral crosstable |
| 39378-5 | XR Knee - right 2 Views and Oblique |
| 39379-3 | XR Knee - right 2 Views and Sunrise |
| 39380-1 | XR Knee - right 2 Views and Sunrise and Tunnel |
| 39381-9 | XR Knee - right 2 Views and Tunnel |
| 39382-7 | XR Knee - right 2 views and (Tunnel W standing) |
| 39383-5 | XR Knee - right 3 Views and Sunrise |
| 39384-3 | XR Knee - right 4 views and (AP W standing) |
| 39385-0 | XR Knee - right 4 Views and Oblique |
| 39386-8 | XR Knee - right 4 views and Tunnel |
| 39387-6 | XR Knee - right 4 Views and Sunrise and Tunnel |
| 39388-4 | XR Knee - right AP and Lateral and Right oblique and Left oblique |
| 39389-2 | XR Knee - right Views and Tunnel |
| 39390-0 | XR Knee - right Views and Oblique |
| 39391-8 | XR Knee - right Views and Sunrise |
| 39392-6 | XR Shoulder - right Internal rotation and External rotation and Axillary |
| 39393-4 | XR Shoulder - right 3 Views and Axillary |
| 39394-2 | XR Shoulder - right 3 Views and Y |
| 39395-9 | XR Shoulder - right AP internal rotation and AP external rotation |
| 39396-7 | XR Shoulder - right AP internal rotation and West Point |
| 39397-5 | XR Shoulder - right AP internal rotation and AP external rotation and West Point |
| 39398-3 | XR Tibia and Fibula - right Views and Oblique |
| 39399-1 | XR Wrist - right 3 Views and Carpal tunnel |
| 39400-7 | XR Wrist - right Views and Carpal tunnel |
| 39401-5 | XR Shoulder AP and Grashey and Axillary |
| 39402-3 | XR Shoulder AP internal rotation and AP external rotation |
| 39403-1 | XR Shoulder Axillary and Transcapular |
| 39404-9 | XR Sinuses 3 Views and Submentovertex |
| 39405-6 | XR Sternum Lateral and right oblique and left oblique |
| 39406-4 | XR Sternum Lateral and right anterior oblique |
| 39407-2 | XR Thoracic spine 5 Views and Oblique |
| 39408-0 | XR tomography Thoracic spine AP |
| 39409-8 | XR tomography Thoracic spine lateral |
| 39410-6 | XR Thoracic spine AP W left bending |
| 39411-4 | XR Thoracic spine AP W right bending |
| 39412-2 | XR Thoracic spine Views and Swimmers |
| 39413-0 | XR Thoracic spine 4 Views and Oblique |
| 39414-8 | XR Thoracic spine Views and Oblique |
| 39415-5 | US Gastrointestinal tract |
| 39416-3 | US Genitourinary tract |
| 39418-9 | US.doppler Extremity vein - bilateral |
| 39419-7 | US.doppler Renal vessels - bilateral |
| 39420-5 | US.doppler Lower extremity vein - bilateral |
| 39421-3 | US.doppler Lower extremity artery - bilateral |
| 39422-1 | US.doppler Lower extremity vessels - bilateral |
| 39423-9 | US.doppler Upper extremity artery - bilateral |
| 39424-7 | US.doppler Extremity vessels limited |
| 39425-4 | US.doppler Iliac artery |
| 39426-2 | US.doppler Renal vessels |
| 39427-0 | US.doppler Carotid arteries - left |
| 39428-8 | US.doppler Extremity artery - left |
| 39429-6 | US.doppler Extremity vein - left |
| 39430-4 | US.doppler Lower extremity vessels - left limited |
| 39431-2 | US.doppler Lower extremity vessels - left |
| 39432-0 | US.doppler Lower extremity vein - left |
| 39433-8 | US.doppler Upper extremity vessels - left |
| 39434-6 | US.doppler Lower extremity artery |
| 39435-3 | US.doppler Renal artery |
| 39436-1 | US.doppler Renal vessels limited |
| 39437-9 | US.doppler Carotid arteries -right |
| 39439-5 | US.doppler Extremity artery - right |
| 39440-3 | US.doppler Extremity vein - right |
| 39441-1 | US.doppler Lower extremity vessels - right limited |
| 39442-9 | US.doppler Lower extremity vessels - right |
| 39443-7 | US.doppler Lower extremity vein - right |
| 39444-5 | US.doppler Upper extremity vessels - right |
| 39445-2 | US.doppler Vessels |
| 39446-0 | US.doppler Testicular vessels |
| 39447-8 | US.doppler Upper extremity artery |
| 39448-6 | US.doppler Upper extremity vessels |
| 39449-4 | US.doppler Extremity vein |
| 39450-2 | US Gastrointestinal tract W contrast PO |
| 39451-0 | US Guidance for drainage of abscess and placement of drainage catheter of Unspecified body region |
| 39452-8 | US Guidance for fluid aspiration of Ovary |
| 39453-6 | US Tendon |
| 39454-4 | US for transplanted liver |
| 39489-0 | XR Ribs lower posterior Views |
| 39490-8 | XR Femur and Tibia - right Views for leg length |
| 39491-6 | XR Ribs upper anterior and posterior - right Views |
| 39492-4 | XR Ribs upper posterior - right Views |
| 39493-2 | XR Ribs lower posterior - right Views |
| 39494-0 | US Abdominal wall |
| 39495-7 | US.doppler Extremity vessels - bilateral |
| 39496-5 | US.doppler Upper extremity vein - bilateral |
| 39497-3 | US.doppler Iliac vessels |
| 39498-1 | US.doppler Femoral vessels - left |
| 39499-9 | US.doppler Lower extremity artery - left |
| 39500-4 | US.doppler Upper extremity artery - left |
| 39501-2 | US.doppler Upper extremity vein - left |
| 39502-0 | US.doppler Ovarian vessels |
| 39503-8 | US.doppler Extremity vessels - right |
| 39504-6 | US.doppler Femoral vessels - right |
| 39505-3 | US.doppler Lower extremity artery - right |
| 39506-1 | US.doppler Upper extremity artery - right |
| 39507-9 | US.doppler Upper extremity vein - right |
| 39508-7 | US.doppler Umbilical vessels Fetal |
| 39509-5 | US for transplanted pancreas |
| 39510-3 | RFA Pelvic lymphatic vessels Views W contrast intra lymphatic |
| 39511-1 | XR Pelvis Views and Oblique |
| 39512-9 | XR Hip - right AP and Danelius Miller |
| 39513-7 | XR Hip - right Views and Danelius Miller |
| 39514-5 | XR Hip - right Danelius Miller |
| 39515-2 | XR Wrist - right Lateral Views W flexion and W extension |
| 39516-0 | XR Shoulder Stryker Notch |
| 39517-8 | XR Shoulder Stryker Notch and West Point |
| 39518-6 | XR Long bones Limited Survey Views |
| 39519-4 | XR Skull PA and Right lateral and Left lateral |
| 39520-2 | XR Skull PA and Right lateral and Left lateral and Towne |
| 39521-0 | XR Skull PA and Right lateral and Left lateral and Caldwell and Towne |
| 39522-8 | US guidance for percutaneous biopsy of Lymph node |
| 39523-6 | US.doppler Artery |
| 39524-4 | US.doppler Vein limited |
| 39525-1 | US.doppler Vein |
| 39526-9 | US Extremity limited |
| 39527-7 | US Unspecified body region for foreign body |
| 39619-2 | NM Pulmonary system Views |
| 39620-0 | NM Guidance for abscess localization limited of Unspecified body region |
| 39621-8 | SPECT Guidance for abscess localization of Unspecified body region |
| 39622-6 | SPECT Guidance for abscess localization of Whole body |
| 39623-4 | NM Guidance for abscess localization of Whole body |
| 39624-2 | NM Adrenal gland Views W I-131 NP59 IV |
| 39625-9 | NM Artery Views W Tc-99m DTPA IA |
| 39626-7 | NM Vein - bilateral Views |
| 39627-5 | NM Bone Limited Views |
| 39628-3 | SPECT Small bowel for Meckel's diverticulum |
| 39629-1 | NM Small bowel Views for Meckel's diverticulum |
| 39630-9 | NM Brain Views W Tc-99m HMPAO IV |
| 39631-7 | SPECT Brain W Tc-99m HMPAO IV |
| 39632-5 | SPECT Brain |
| 39634-1 | NM Brain Limited Views |
| 39635-8 | NM Brain Views W Tl-201 IV |
| 39636-6 | NM Brain Views for blood flow |
| 39637-4 | SPECT Brain for blood flow |
| 39638-2 | SPECT Brain W I-123 IV |
| 39639-0 | SPECT Brain W Tl-201 IV |
| 39640-8 | SPECT Brain W Tc-99m DTPA IV |
| 39641-6 | SPECT Brain W Tc-99m glucoheptonate IV |
| 39642-4 | NM Brain Views W Tc-99m glucoheptonate IV |
| 39643-2 | NM Brain veins Views |
| 39644-0 | SPECT Breast |
| 39645-7 | NM Breast Limited Views |
| 39646-5 | NM Breast Views |
| 39647-3 | SPECT Heart W Tc-99m Tetrofosmin IV |
| 86956-0 | CT Heart WO contrast IV and CT Heart for left ventricular function W contrast IV |
| 39648-1 | SPECT Heart W dipyridamole IV |
| 79073-3 | CTA Heart and Coronary arteries W contrast IV |
| 39649-9 | SPECT Heart |
| 86980-0 | CTA Heart and Coronary arteries WO and W contrast IV |
| 39650-7 | NM Heart Views |
| 87117-8 | Guidance for pericardiocentesis of Heart |
| 39651-5 | NM Heart Views W adenosine and W Tl-201 IV |
| 39652-3 | NM Heart Views W dobutamine and W Tl-201 IV |
| 39653-1 | NM Heart Views for infarct |
| 44126-1 | MR Heart cine for blood flow velocity mapping W contrast IV |
| 39654-9 | SPECT Heart for infarct W Tc-99m PYP IV |
| 39655-6 | SPECT Heart for infarct W Tc-99m Sestamibi IV |
| 39656-4 | SPECT Heart for infarct |
| 44127-9 | MR Heart limited cine for function |
| 39657-2 | NM Heart Views for infarct W Tc-99m PYP IV |
| 39658-0 | SPECT Heart at rest and W radionuclide IV |
| 58750-1 | MR Heart W stress |
| 39660-6 | NM Heart Views at rest and W dipyridamole and W radionuclide IV |
| 95923-9 | MR Heart W stress and W contrast IV |
| 39661-4 | NM Heart Views at rest and W dobutamine and W radionuclide IV |
| 58749-3 | MR Heart W stress and WO and W contrast IV |
| 39662-2 | SPECT Heart at rest and W stress and W Tc-99m Sestamibi IV |
| 80500-2 | MR Heart W stress and WO contrast |
| 39663-0 | NM Heart Views at rest and W stress and W radionuclide IV |
| 39664-8 | NM Heart Views for shunt detection W Tc-99m MAA IV |
| 39665-5 | NM Heart Views for shunt detection |
| 39666-3 | NM Heart Views W stress and W 201 Th IV |
| 42166-9 | NM Heart 2 Views at rest and W Tl-201 IV |
| 39667-1 | NM Heart Views W stress and W radionuclide IV |
| 39861-0 | NM Heart Blood pool |
| 39668-9 | SPECT Heart W stress and W radionuclide IV |
| 81612-4 | NM Heart Blood pool and Ejection fraction and First pass |
| 39669-7 | NM Whole body Views W Tc-99m Arcitumomab IV |
| 39670-5 | NM Lacrimal duct Views W radionuclide intra lacrimal duct |
| 39671-3 | NM Rectum Views W radionuclide PO |
| 39672-1 | NM Esophagus Views for motility W radionuclide PO |
| 39673-9 | NM Esophagus Views for reflux W radionuclide PO |
| 39674-7 | NM Gallbladder Views W Tc-99m DISIDA IV |
| 39675-4 | SPECT Whole body for infection W Ga-67 IV |
| 39677-0 | NM Unspecified body region Views for infection W Ga-67 IV |
| 39678-8 | SPECT Whole body for tumor W Ga-67 IV |
| 39679-6 | NM Unspecified body region Views for tumor W Ga-67 IV |
| 39680-4 | SPECT Whole body W Ga-67 IV |
| 39681-2 | SPECT Unspecified body region limited W Ga-67 IV |
| 39682-0 | SPECT Unspecified body region W Ga-67 IV |
| 39683-8 | NM Whole body Views W Ga-67 IV |
| 39684-6 | SPECT Unspecified body region for abscess W Ga-67 IV |
| 39685-3 | NM Unspecified body region Views for abscess W Ga-67 IV |
| 39686-1 | NM Whole body Views for lymphoma W Ga-67 IV |
| 39687-9 | NM Unspecified body region Limited Views W Ga-67 IV |
| 39688-7 | NM Unspecified body region Views W Ga-67 IV |
| 39689-5 | NM Gastrointestinal tract Views W Tc-99m SC IV |
| 39690-3 | NM Liver Views W Tc-99m tagged RBC IV |
| 39691-1 | SPECT Liver W Tc-99m tagged RBC IV |
| 39692-9 | SPECT Liver |
| 39693-7 | NM Liver Views |
| 39694-5 | NM Views for transplanted liver |
| 39695-2 | NM Lung Limited Views |
| 39696-0 | NM Lung Views W depreotide IV |
| 39697-8 | NM Lung Perfusion |
| 39698-6 | NM Whole body Views W I-131 MIBG IV |
| 39699-4 | NM Heart Perfusion at rest and W Tc-99m Sestamibi IV |
| 39860-2 | NM Heart Blood pool W stress and W radionuclide IV |
| 39700-0 | SPECT Heart perfusion W adenosine and W radionuclide IV |
| 39864-4 | NM Heart First pass |
| 39701-8 | NM Heart Perfusion W adenosine and W radionuclide IV |
| 81563-9 | NM Heart First pass and Blood pool |
| 39702-6 | NM Heart Perfusion W dobutamine and W Tc-99m Sestamibi IV |
| 39889-1 | NM Heart First pass and Ejection fraction |
| 39703-4 | NM Heart Perfusion W dobutamine IV |
| 39887-5 | NM Heart First pass and Ejection fraction at rest and W radionuclide IV |
| 39704-2 | NM Heart Perfusion W Tc-99m Sestamibi IV |
| 39885-9 | NM Heart First pass and Ventricular volume |
| 39705-9 | NM Heart Perfusion W dipyridamole and W Tc-99m Sestamibi IV |
| 39890-9 | NM Heart First pass and Wall motion |
| 39707-5 | NM Heart Perfusion W dipyridamole and W Tl-201 IV |
| 39910-5 | NM Heart First pass and Wall motion and Ejection fraction |
| 39708-3 | NM Heart Perfusion W dipyridamole IV |
| 39912-1 | NM Heart First pass and Wall motion and Ventricular volume and Ejection fraction |
| 39709-1 | NM Heart Perfusion W dipyridamole and W Tc-99m IV |
| 39909-7 | NM Heart First pass and Wall motion and Ventricular volume and Ejection fraction W stress and W radionuclide IV |
| 39710-9 | SPECT Heart perfusion W Tc-99m Sestamibi IV |
| 39908-9 | NM Heart First pass and Wall motion and Ventricular volume W stress and W radionuclide IV |
| 39711-7 | SPECT Heart perfusion W Tl-201 IV |
| 39886-7 | NM Heart First pass and Wall motion at rest and W radionuclide IV |
| 39712-5 | SPECT Heart perfusion |
| 39888-3 | NM Heart First pass and Wall motion W stress and W radionuclide IV |
| 39713-3 | NM Heart Perfusion W Tl-201 IV and W Tc-99m Tetrofosmin IV |
| 39867-7 | NM Heart First pass at rest and W radionuclide IV |
| 39714-1 | NM Heart Perfusion W Tl-201 IV |
| 39863-6 | NM Heart First pass at rest and W stress and W radionuclide IV |
| 39715-8 | NM Heart Perfusion W stress and W Tl-201 IV |
| 39866-9 | NM Heart First pass at rest and W Tc-99m Sestamibi IV |
| 39716-6 | NM Heart Perfusion |
| 39869-3 | NM Heart First pass W stress and W radionuclide IV |
| 39718-2 | SPECT Heart perfusion at rest and W radionuclide IV |
| 39868-5 | NM Heart First pass W stress and W Tc-99m Sestamibi IV |
| 39719-0 | NM Heart Perfusion at rest and W adenosine and W radionuclide IV |
| 39915-4 | NM Heart Gated |
| 39720-8 | NM Heart Perfusion at rest and W dipyridamole and W Tc-99m Sestamibi IV |
| 81566-2 | NM Heart Gated and Blood pool and Ejection fraction and Wall motion W multiple states of exercise |
| 39722-4 | NM Heart Perfusion at rest and W dipyridamole and W radionuclide IV |
| 81567-0 | NM Heart Gated and Blood pool and Ejection fraction and Wall motion W single state of exercise |
| 39723-2 | SPECT Heart perfusion at rest and W stress and W Tl-201 IV |
| 39917-0 | NM Heart Gated and Ejection fraction |
| 39724-0 | SPECT Heart perfusion at rest and W stress and W radionuclide IV |
| 39923-8 | NM Heart Gated and Ejection fraction at rest and W radionuclide IV |
| 39725-7 | SPECT Heart perfusion at rest and W adenosine and W Tl-201 IV |
| 39919-6 | NM Heart Gated and First pass |
| 39726-5 | NM Heart Perfusion at rest and W stress and W radionuclide IV |
| 42306-1 | NM Heart Gated and Wall motion |
| 39727-3 | NM Heart Perfusion at rest and W stress and W Tc-99m Sestamibi IV |
| 39931-1 | NM Heart Gated and Wall motion and Ejection fraction |
| 39728-1 | NM Heart Perfusion at rest and W radionuclide IV |
| 39925-3 | NM Heart Gated and Wall motion and Ejection fraction at rest and W radionuclide IV |
| 39729-9 | SPECT Heart perfusion at rest and W Tl-201 IV |
| 39929-5 | NM Heart Gated and Wall motion W stress and W radionuclide IV |
| 39730-7 | NM Heart Perfusion W stress and W radionuclide IV |
| 39921-2 | NM Heart Gated at rest and W radionuclide IV |
| 39731-5 | NM Heart Perfusion W adenosine and W Tc-99m Sestamibi IV |
| 39924-6 | NM Heart Gated at rest and W stress and W radionuclide IV |
| 39732-3 | NM Heart Perfusion W stress and W Tc-99m Sestamibi IV |
| 39922-0 | NM Heart Gated at rest and W Tc-99m pertechnetate IV |
| 39733-1 | NM Heart Perfusion W dobutamine and W Tl-201 IV |
| 39920-4 | NM Heart Gated at rest and W Tc-99m Sestamibi IV |
| 39734-9 | SPECT Heart perfusion W stress and W radionuclide IV |
| 39928-7 | NM Heart Gated W stress and W radionuclide IV |
| 39735-6 | NM Heart Perfusion W adenosine and W Tl-201 IV |
| 39927-9 | NM Heart Gated W stress and W Tc-99m pertechnetate IV |
| 39736-4 | SPECT Heart perfusion W stress and W Tc-99m Sestamibi IV |
| 39914-7 | NM Heart Gated W Tc-99m Sestamibi IV |
| 39737-2 | NM Neck Views |
| 39738-0 | NM Abdomen Views W In-111 Satumomab IV |
| 39739-8 | NM Pancreas Views |
| 39740-6 | SPECT Parathyroid gland |
| 39741-4 | NM Parathyroid gland Delayed Views |
| 39742-2 | NM Parathyroid gland Views |
| 39743-0 | SPECT Prostate W Tc-99m capromab pendatide IV |
| 39744-8 | NM Prostate Views W Tc-99m capromab pendatide IV |
| 39745-5 | NM Kidney Views W Tc-99m DTPA IV |
| 39746-3 | NM Kidney Views W Tc-99m Mertiatide IV |
| 39747-1 | NM Salivary gland Views |
| 39748-9 | SPECT Whole body for tumor W Tc-99m Sestamibi IV |
| 39749-7 | NM Whole body Views for tumor W Tc-99m Sestamibi IV |
| 39750-5 | NM Unspecified body region Views for tumor W Tc-99m Sestamibi IV |
| 39751-3 | NM Spleen Views |
| 39752-1 | NM Spleen Views W radionuclide tagged heat damaged RBC IV |
| 39753-9 | NM Scrotum and testicle Views W Tc-99m DTPA IV |
| 39754-7 | NM Thyroid gland Limited Views W I-131 IV |
| 39755-4 | SPECT Thyroid gland W I-131 IV |
| 39756-2 | NM Thyroid gland Views W Tc-99m Sestamibi IV |
| 39757-0 | NM Thyroid gland Views W Tc-99m IV |
| 39758-8 | NM Guidance for localization of tumor of Breast |
| 39759-6 | SPECT Guidance limited for localization of tumor |
| 39760-4 | NM Guidance limited for localization of tumor |
| 39761-2 | NM Guidance limited for localization of tumor-- W Tc-99m Sestamibi IV |
| 39762-0 | SPECT Guidance for localization of tumor of Whole body |
| 39763-8 | NM Guidance for localization of tumor of Whole body |
| 39764-6 | NM Vein Views W Tc-99m SC IV |
| 39765-3 | NM Vein Views W Tc-99m DTPA IV |
| 39766-1 | NM Vein Views W Tc-99m HDP IV |
| 39767-9 | NM Stomach Views for gastric emptying liquid phase W radionuclide PO |
| 39768-7 | NM Stomach Views for gastric emptying W Tc-99m SC PO |
| 39769-5 | NM Stomach Views for gastric emptying W radionuclide PO |
| 39770-3 | SPECT Gastrointestinal tract |
| 39811-5 | SPECT Unspecified body region for abscess |
| 39812-3 | NM Bone Views W Tc-99m HMPAO IV |
| 39813-1 | SPECT Bone limited |
| 39816-4 | SPECT Whole body Bone |
| 39818-0 | NM Whole body Bone Views |
| 39819-8 | NM Bone Delayed Views |
| 39820-6 | NM Bone Views W Sm-153 IV |
| 39821-4 | SPECT Bone marrow limited |
| 39822-2 | NM Bone marrow Limited Views |
| 39823-0 | SPECT Bone marrow |
| 39824-8 | NM Bone marrow Views |
| 39825-5 | SPECT Whole body Bone marrow |
| 39826-3 | NM Whole body Bone marrow Views |
| 39827-1 | NM Whole body Views for endocrine tumor W I-131 MIBG IV |
| 39828-9 | NM Whole body Views for endocrine tumor W In-111 pentetreotide IV |
| 39829-7 | NM Whole body Views for tumor W Ga-67 IV |
| 39830-5 | NM Whole body Views for infection W Ga-67 IV |
| 39831-3 | NM Unspecified body region Limited Views for tumor W Ga-67 IV |
| 39834-7 | NM Lung Ventilation W Tc-99m DTPA aerosol IH |
| 39837-0 | NM Lung Ventilation |
| 39838-8 | SPECT Lung ventilation and perfusion |
| 39839-6 | SPECT Whole body W I-131 MIBG IV |
| 39840-4 | NM Whole body Delayed Views W I-131 MIBG IV |
| 39841-2 | NM Unspecified body region Views W I-131 MIBG IV |
| 39842-0 | NM Whole body Delayed Views W In-111 Satumomab IV |
| 39843-8 | NM Unspecified body region Limited Views W In-111 Satumomab IV |
| 39844-6 | SPECT Whole body W In-111 Satumomab IV |
| 39845-3 | NM Whole body Views W In-111 Satumomab IV |
| 39846-1 | NM Unspecified body region Views W In-111 Satumomab IV |
| 39847-9 | NM Parotid gland Views for blood flow |
| 39848-7 | NM Head to Pelvis Views for shunt patency W In-111 IT |
| 39849-5 | NM Head to Pelvis Views for shunt patency W radionuclide IT |
| 39850-3 | NM Kidney - bilateral Views W I-131 IV |
| 39851-1 | SPECT Kidney - bilateral W Tc-99m Mertiatide IV |
| 39852-9 | SPECT Kidney - bilateral |
| 39856-0 | NM Thyroid gland Views for blood flow |
| 39857-8 | NM Adrenal gland Views W I-131 MIBG IV |
| 39858-6 | NM Bone Views for blood flow |
| 39859-4 | NM Brain Delayed Views |
| 39862-8 | SPECT Heart blood pool at rest and W radionuclide IV |
| 43777-2 | NM Heart Perfusion at rest and W adenosine and W Tl-201 IV |
| 39865-1 | NM Left ventricle First pass |
| 39728-1 |  IV |
| 39870-1 | NM Heart Views for blood flow W Tc-99m pertechnetate IV |
| 43660-0 | NM Heart Perfusion qualitative at rest and W radionuclide IV |
| 39871-9 | NM Heart Views for blood flow |
| 43658-4 | NM Heart Perfusion quantitative |
| 39872-7 | SPECT Heart wall motion |
| 43661-8 | NM Heart Perfusion quantitative at rest and W radionuclide IV |
| 39873-5 | NM Heart Wall motion |
| 39874-3 | NM Cerebral cisterns Delayed Views W radionuclide IT |
| 39875-0 | NM Whole body Delayed Views W Ga-67 IV |
| 39876-8 | SPECT Liver and Spleen |
| 39877-6 | NM Liver and Spleen Views |
| 39879-2 | SPECT Bone |
| 39880-0 | NM Bone 2 Phase Views |
| 39881-8 | SPECT Whole body Bone 3 phase |
| 39882-6 | NM Whole body Bone 3 Phase Views |
| 39883-4 | NM Bone 3 Phase Views |
| 39884-2 | NM Bone Blood pool |
| 39891-7 | NM Heart Views for infarct and first pass W Tc-99m PYP IV |
| 39892-5 | NM Heart Views for infarct and first pass |
| 39893-3 | NM Heart Views for blood flow and shunt detection |
| 39895-8 | NM Gallbladder Views for ejection fraction W Tc-99m DISIDA IV |
| 39897-4 | NM Lung and Liver Views |
| 39898-2 | SPECT Lung ventilation |
| 39899-0 | NM Salivary gland Views for blood flow |
| 39901-4 | NM Bone 3 Phase Views multiple areas |
| 39902-2 | NM Bone 3 Phase Views single area |
| 39904-8 | NM Bone Multiple area Views |
| 39905-5 | SPECT Bone multiple areas |
| 39906-3 | SPECT Bone marrow multiple areas |
| 39907-1 | NM Bone marrow Multiple area Views |
| 81571-2 | NM Heart Perfusion W multiple states of exercise |
| 81570-4 | NM Heart Perfusion W single state of exercise |
| 39913-9 | SPECT Heart gated and ejection fraction |
| 39916-2 | SPECT Heart gated |
| 43646-9 | NM Heart Qualitative and Quantitative Views for infarct |
| 39918-8 | SPECT Heart gated and wall motion |
| 43645-1 | NM Heart Qualitative Views for infarct |
| 43647-7 | NM Heart Quantitative Views for infarct |
| 42309-5 | NM Heart Views at rest and W stress and W Tl-201 IV |
| 39930-3 | SPECT Heart gated W stress and W radionuclide IV |
| 39932-9 | NM Heart Wall motion and Ejection fraction |
| 39933-7 | NM Unspecified body region Views for infection multiple areas W Ga-67 IV |
| 39934-5 | NM Unspecified body region Views for tumor multiple areas W Ga-67 IV |
| 39935-2 | NM Unspecified body region Multiple area Views W Ga-67 IV |
| 39936-0 | NM Joint Limited Views |
| 39937-8 | NM Joint Multiple area Views W radionuclide XXX |
| 39938-6 | SPECT Joint |
| 39939-4 | NM Joint Views |
| 39940-2 | NM Lung Clearance W Tc-99m DTPA aerosol IH |
| 39942-8 | NM Lung Ventilation and Perfusion |
| 39944-4 | NM Lung Ventilation and Equilibrium and Washout |
| 39946-9 | NM Lung Ventilation and Perfusion and Differential |
| 39947-7 | NM Lung Ventilation and Equilibrium |
| 39949-3 | NM Unspecified body region Multiple area Views W In-111 Satumomab IV |
| 39950-1 | NM Prostate Multiple area Views W Tc-99m capromab pendatide IV |
| 39951-9 | NM Unspecified body region Views for tumor multiple areas W Tc-99m Sestamibi IV |
| 39952-7 | NM Scrotum and testicle Views for blood flow and function |
| 39953-5 | NM Guidance for localization of tumor multiple areas of Unspecified body region |
| 39954-3 | NM Vein Views for thrombosis |
| 41770-9 | NM Gallbladder Views W cholecystokinin and W radionuclide IV |
| 41771-7 | NM Kidney Views W Tc-99m DMSA IV |
| 41772-5 | SPECT Bone W In-111 tagged WBC IV |
| 41773-3 | Portable XR Facial bones Views |
| 41774-1 | Portable XR Neck Lateral |
| 41775-8 | Portable XR Pelvis Single view |
| 41776-6 | Portable XR Pelvis and Hip - right AP and Lateral frog |
| 41777-4 | Portable XR Hip - right AP and Lateral |
| 41778-2 | Portable XR Femur - right Views |
| 41779-0 | Portable XR Knee - right Views |
| 41782-4 | Portable XR Ankle - right Views |
| 41783-2 | Portable XR Shoulder - right Views |
| 41784-0 | Portable XR Humerus - right Views |
| 41785-7 | XR Elbow - right Limited Views |
| 41786-5 | Portable XR Elbow - right Views |
| 41787-3 | Portable XR Wrist - right Views |
| 41788-1 | Portable XR Hand - right Views |
| 41789-9 | XR Hand - right Limited Views |
| 41790-7 | XR Chest Single view during surgery |
| 41791-5 | Portable XR Ribs - right Views |
| 41792-3 | XR Chest Right oblique and Left oblique |
| 41793-1 | XR Abdomen Single view during surgery |
| 41795-6 | RF Upper gastrointestinal tract and Small bowel Single view W air contrast PO |
| 41797-2 | RF Colon Limited Views W air and barium contrast PR |
| 41798-0 | US Guidance for drainage and placement of drainage catheter of Prostate |
| 41799-8 | RF Guidance for placement of tube in Liver |
| 41800-4 | RF Guidance for drainage and placement of drainage catheter of Pharynx |
| 41801-2 | RFA Guidance for placement of catheter in Portal vein-- W contrast IV |
| 41802-0 | RF Guidance for biopsy of Prostate |
| 41803-8 | RF Guidance for biopsy of Breast |
| 41806-1 | CT Abdomen |
| 41807-9 | CT Orbit |
| 41808-7 | CT Maxillofacial region |
| 41809-5 | US Guidance for drainage and placement of drainage catheter of Retroperitoneum |
| 41811-1 | XR Ribs - bilateral Views and Chest PA |
| 41812-9 | US Lower extremity artery limited |
| 41813-7 | US Upper extremity artery limited |
| 41814-5 | US Upper extremity artery - right |
| 41815-2 | US Lower extremity artery - right |
| 41816-0 | US Extremity veins - right |
| 41817-8 | Portable XR Hip - left AP and Lateral |
| 41818-6 | Portable XR Femur - left Views |
| 41819-4 | XR Knee - left 2 Views and Tunnel |
| 41820-2 | Portable XR Knee - left Views |
| 41823-6 | Portable XR Ankle - left Views |
| 41824-4 | Portable XR Shoulder - left Views |
| 41825-1 | Portable XR Humerus - left Views |
| 41826-9 | XR Elbow - left Limited Views |
| 41827-7 | Portable XR Elbow - left Views |
| 41828-5 | Portable XR Wrist - left Views |
| 41829-3 | Portable XR Hand - left Views |
| 41830-1 | XR Hand - left Limited Views |
| 41831-9 | Portable XR Ribs - left Views |
| 41832-7 | XR Ribs - left Views and Chest PA |
| 41833-5 | US Upper extremity artery - left |
| 41834-3 | US Lower extremity artery - left |
| 41835-0 | US Extremity veins - left |
| 41836-8 | NM Bone Limited Views W In-111 tagged WBC IV |
| 41837-6 | SPECT Whole body W Tc-99m Arcitumomab IV |
| 41838-4 | SPECT Prostate W In-111 Satumomab IV |
| 42007-5 | XR Mastoid - bilateral Limited Views |
| 42008-3 | XR Humerus Single view during surgery |
| 42009-1 | XR Chest 2 Views and Apical lordotic |
| 42010-9 | XR Ribs - right Views and Chest PA |
| 42011-7 | XR Chest PA and Abdomen AP |
| 42012-5 | RF Gastrointestinal tract upper Views W water soluble contrast PO |
| 42014-1 | RF Urinary bladder and Urethra Views W contrast |
| 42017-4 | RF Guidance for percutaneous replacement of cholecystostomy of Abdomen |
| 42018-2 | RFA Guidance for percutaneous transluminal angioplasty of Vein-- W contrast IA |
| 42019-0 | XR Abdomen upright and left lateral decubitus |
| 42020-8 | CT Guidance for needle localization of Lumbar spine |
| 42021-6 | CT Guidance for needle localization of Cervical spine |
| 42132-1 | US Breast screening |
| 42133-9 | US Guidance for drainage of abscess and placement of drainage catheter of Liver |
| 42134-7 | US Guidance for fluid aspiration of Thyroid gland |
| 42135-4 | US Guidance for superficial biopsy of Bone |
| 42137-0 | US Guidance for biopsy of Mediastinum |
| 42140-4 | US Guidance for placement of tube in Chest |
| 42141-2 | US Guidance for removal of tunneled CV catheter |
| 42143-8 | US Uterus and Fallopian tubes W saline IU |
| 42144-6 | US Extremity vein - right |
| 42145-3 | US Extremity vein - left |
| 42146-1 | US.doppler Carotid arteries |
| 42147-9 | US.doppler Iliac graft |
| 42148-7 | US Heart |
| 42149-5 | US Carotid arteries - left limited |
| 42150-3 | US.doppler Iliac graft limited |
| 42151-1 | US Carotid arteries -right limited |
| 42152-9 | US.doppler Pelvis vessels limited |
| 42153-7 | XR Extremity Single view |
| 42156-0 | RFA Vessels Views W contrast IA |
| 42157-8 | RFA Extremity vessels Views W contrast IV |
| 42158-6 | NM Adrenal gland Views |
| 42159-4 | XR Sella turcica Views |
| 42160-2 | XR Unspecified body region Views for shunt patency |
| 42161-0 | NM Heart Views W dobutamine IV |
| 42163-6 | XR Lumbar spine Views and Oblique |
| 42164-4 | XR Cervical spine Views and Oblique |
| 42165-1 | XR Ribs Views and Chest PA |
| 42167-7 | XR Pelvis and Hip - bilateral AP and Lateral frog |
| 42168-5 | FFD mammogram Breast - right Diagnostic |
| 42169-3 | FFD mammogram Breast - left Diagnostic |
| 42170-1 | NM Whole body Views for lymphoma |
| 42171-9 | NM Whole body Views for tumor |
| 42174-3 | FFD mammogram Breast - bilateral Screening |
| 42175-0 | NM Whole body Views |
| 42260-0 | CT Guidance for biopsy of Unspecified body region-- W contrast IV |
| 42261-8 | NM Kidney Views for blood flow |
| 42262-6 | NM Liver Views for blood flow |
| 42263-4 | NM Spleen Views for blood flow |
| 42265-9 | CT Guidance for superficial biopsy of Bone |
| 42268-3 | CT Extremity WO and W contrast IV |
| 42269-1 | XR Chest and Abdomen Views |
| 42270-9 | MR Cervical spine W flexion and W extension |
| 42271-7 | NM Thyroid gland Views and Views uptake W I-123 IV |
| 42272-5 | XR Chest PA and Lateral |
| 42273-3 | XR Ankle - bilateral 6 Views |
| 42274-1 | CT Abdomen and Pelvis WO and W contrast IV |
| 42275-8 | CT Chest and Abdomen W contrast IV |
| 42276-6 | CT Chest and Abdomen WO contrast |
| 42277-4 | CT Chest and Abdomen WO and W contrast IV |
| 42278-2 | CT Extremity WO contrast |
| 42279-0 | CT Guidance for biopsy of Kidney |
| 42280-8 | CT Guidance for drainage of abscess and placement of drainage catheter of Appendix |
| 42281-6 | CT Guidance for drainage of abscess and placement of drainage catheter of Chest |
| 42282-4 | CT Guidance for drainage of abscess and placement of drainage catheter of Liver |
| 42283-2 | CT Guidance for drainage and placement of drainage catheter of Pancreas |
| 42284-0 | CT Guidance for drainage of abscess and placement of chest tube of Pleural space |
| 42285-7 | CT Guidance for drainage of abscess and placement of drainage catheter of Kidney |
| 42286-5 | CT Guidance for drainage of abscess and placement of drainage catheter of Pelvis |
| 42287-3 | CT Guidance for drainage and placement of drainage catheter of Retroperitoneum |
| 42291-5 | CT Retroperitoneum WO contrast |
| 42292-3 | SPECT Whole body for tumor W Tl-201 IV |
| 42293-1 | CTA Head vessels WO contrast |
| 42294-9 | CTA Pelvis vessels W contrast IV |
| 42295-6 | CTA Upper extremity vessels W contrast IV |
| 42296-4 | MG Guidance for localization of Breast - left |
| 42297-2 | MG Guidance for localization of Breast - right |
| 42298-0 | MR Unspecified body region WO and W contrast IV |
| 42299-8 | MR Clavicle WO and W contrast IV |
| 42300-4 | MR Thyroid gland |
| 42301-2 | MR Uterus |
| 42302-0 | MR Clavicle WO contrast |
| 42303-8 | MR Orbit and Face |
| 42304-6 | MRA Head vessels and Neck vessels |
| 42305-3 | NM Whole body Views for tumor W Tl-201 IV |
| 42308-7 | NM Scrotum and testicle Views for blood flow |
| 42310-3 | SPECT Kidney |
| 42311-1 | XR Orbit - left Views for foreign body |
| 42312-9 | XR Orbit - right Views for foreign body |
| 42313-7 | XR Ribs - left Single view |
| 42314-5 | XR Ribs - right Single view |
| 42333-5 | US Guidance for biopsy of Chest Pleura |
| 42334-3 | RFA Guidance for injection of Internal thoracic artery - left |
| 42335-0 | RF Cervical spine Limited Views W contrast IT |
| 42377-2 | CT perfusion Head W Xe-133 IH+WO and W contrast IV |
| 42378-0 | XR Lumbar spine AP W left bending |
| 42379-8 | XR Lumbar spine AP W right bending |
| 42380-6 | XR Ankle - left AP and Lateral W standing |
| 42381-4 | XR Ribs lower posterior - left Views |
| 42382-2 | XR Ankle - left Lateral and Mortise and Broden W manual stress |
| 42383-0 | XR Gallbladder Views W contrast PO and W contrast PO |
| 42385-5 | MR Brain and Pituitary and Sella turcica |
| 42386-3 | MR Brain cine for CSF flow |
| 42387-1 | MR Unspecified body region cine for CSF flow |
| 42388-9 | MR Prostate Endorectal |
| 42389-7 | MR Pelvis Endorectal |
| 42390-5 | MR Endovaginal |
| 42391-3 | MR Brain and Pituitary and Sella turcica W contrast IV |
| 42392-1 | MR Brain and Pituitary and Sella turcica WO and W contrast IV |
| 42393-9 | MR Brain and Pituitary and Sella turcica WO contrast |
| 42394-7 | CT Pulmonary system W Xe-133 IH |
| 42395-4 | XR Foot sesamoid bones - bilateral Axial |
| 42396-2 | XR Foot sesamoid bones - left Axial |
| 42397-0 | XR.stereoscopic Chest Frontal Views |
| 42398-8 | XR Foot Oblique and (AP and Lateral W standing) |
| 42399-6 | XR Foot sesamoid bones Views |
| 42400-2 | XR Foot sesamoid bones - bilateral Views |
| 42401-0 | XR Lumbar spine Lumbar (AP W R-bending and W L-bending and WO bending) and Lateral |
| 42402-8 | XR Unspecified body region Post morten Views |
| 42403-6 | XR Lumbar spine Views AP W right bending and W left bending |
| 42404-4 | XR Hip - left AP and Lateral Views for measurement |
| 42405-1 | XR Knee (AP W standing) and (Lateral W extension) |
| 42406-9 | XR Lumbar spine Views AP W and WO left bending |
| 42407-7 | XR Lumbar spine Views AP W and WO right bending |
| 42408-5 | XR Lumbar spine Views AP W right bending and W left bending and WO bending |
| 42409-3 | XR Foot sesamoid bones AP and Lateral |
| 42410-1 | XR Lumbar spine AP and Lateral and Oblique and Spot W standing |
| 42411-9 | XR Lumbar spine (AP^W R-bending and W L-bending) and (Lateral^W flexion and W extension) |
| 42412-7 | XR Shoulder - left 90 degree abduction Views |
| 42413-5 | XR Lumbar spine Views W right bending and W left bending |
| 42414-3 | XR Chest Right oblique and Left oblique W nipple markers |
| 42415-0 | MG Breast - bilateral Views Post Wire Placement |
| 42416-8 | MG Breast - left Views Post Wire Placement |
| 42417-6 | XR Ankle - bilateral AP and Lateral and Oblique and (View W manual stress) |
| 42418-4 | XR Ankle - left AP and Lateral and Oblique and (View W manual stress) |
| 42419-2 | XR Wrist - bilateral Single view |
| 42420-0 | XR Pelvis AP W standing |
| 42421-8 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Unspecified body region |
| 42422-6 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Breast |
| 42423-4 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Chest |
| 42424-2 | XR Thoracic and lumbar spine AP and lateral for scoliosis W sitting |
| 42425-9 | XR Thoracic and lumbar spine AP Views for scoliosis W standing and W right bending and W left bending and WO bending |
| 42426-7 | XR Thoracic and lumbar spine AP for scoliosis W sitting |
| 42427-5 | XR Thoracic and lumbar spine Lateral for scoliosis W sitting |
| 42428-3 | XR Thoracic and lumbar spine AP for scoliosis W standing in brace |
| 42429-1 | XR Thoracic and lumbar spine AP for scoliosis W standing and W right bending |
| 42430-9 | XR Knee - right 2 views and (Views W standing) |
| 42431-7 | XR Knee - right PA 30 degree flexion W standing |
| 42432-5 | XR Knee - right Sunrise and (Views W standing) |
| 42433-3 | MG stereo Guidance for percutaneous biopsy.core needle of Breast - right |
| 42434-1 | XR Foot sesamoid bones - right Views |
| 42435-8 | XR Sella turcica 2 Views |
| 42436-6 | XR Sella turcica Lateral and Towne |
| 42437-4 | XR tomography Sella turcica |
| 42438-2 | XR Neck AP and Lateral |
| 42439-0 | XR Neck AP |
| 42441-6 | XR Neck Magnification |
| 42442-4 | XR Spine Lateral W standing |
| 42443-2 | XR Thoracic spine 3 Views W standing |
| 42444-0 | XR Thoracic spine Views AP W right bending and W left bending and WO bending |
| 42445-7 | XR Thoracic spine Views AP W left bending and WO bending |
| 42446-5 | XR Thoracic spine Views AP W right bending and WO bending |
| 42447-3 | US Guidance for aspiration of cyst of Thyroid gland |
| 42448-1 | US Guidance for excisional biopsy of Breast |
| 42449-9 | US Guidance for biopsy of Breast - left |
| 42450-7 | US Guidance for aspiration of cyst of Breast - left |
| 42455-6 | US Pelvis transabdominal and transvaginal |
| 42456-4 | US Guidance for placement of needle wire in Breast |
| 42457-2 | US Guidance for biopsy of Breast - right |
| 42458-0 | US Guidance for aspiration of cyst of Breast - right |
| 42459-8 | RF Gastrointestinal tract upper Views W contrast PO |
| 42460-6 | RF Submandibular gland - left Views W contrast intra salivary duct |
| 42461-4 | US.doppler Lower extremity vessel - left for graft |
| 42462-2 | US.doppler Lower extremity vessel - right for graft |
| 42463-0 | US Guidance for biopsy of Endomyocardium |
| 42468-9 | US Surgical specimen |
| 42469-7 | RF Gastrointestinal tract upper and Small bowel and Gallbladder Single view W contrast PO |
| 42470-5 | RF Gastrointestinal tract upper and Gallbladder Single view W contrast PO |
| 42471-3 | XR.stereoscopic Pelvis Single view |
| 42472-1 | XR Thoracic and lumbar spine AP Views for scoliosis in traction |
| 42473-9 | XR.stereoscopic Sinuses Waters |
| 42474-7 | XR.stereoscopic Skull Single view |
| 42475-4 | US.doppler Upper extremity vessel - left for graft |
| 42476-2 | US.doppler Upper extremity vessel - right for graft |
| 42477-0 | US.doppler for transplanted kidney vessels |
| 42478-8 | US Guidance for drainage of cyst and placement of drainage catheter of Kidney |
| 42680-9 | MG Breast XCCL |
| 42681-7 | RF Colon Views W gastrografin PR |
| 42684-1 | RF Gastrointestinal tract upper Views W gastrografin PO |
| 42685-8 | XR Pelvis and Hip - left 2 Views |
| 42686-6 | XR Pelvis and Hip - right 2 Views |
| 42687-4 | XR Ribs - bilateral 2 Views |
| 42688-2 | CT Guidance for nerve block of Spine |
| 42689-0 | XR Spine Oblique |
| 42690-8 | XR Spine Views W flexion and W extension |
| 42691-6 | XR Cervical spine 6 Views |
| 42692-4 | XR Thoracic and lumbar spine Views |
| 42693-2 | MR Urinary bladder and Urethra cine |
| 42694-0 | MR Clavicle W contrast IV |
| 42695-7 | MR Lower leg - bilateral W contrast IV |
| 42696-5 | MR Lower leg - bilateral |
| 42697-3 | MR Lower leg - bilateral WO and W contrast IV |
| 42698-1 | MR Cervical and thoracic and lumbar spine |
| 42699-9 | XR Chest and Abdomen Single view |
| 42700-5 | NM Bone Views W Tc-99m tagged WBC IV |
| 42701-3 | CT Guidance for localization of placenta of Uterus |
| 42702-1 | RF Greater than 1 hour |
| 42703-9 | RF Less than 1 hour |
| 42705-4 | US Guidance for drainage of abscess and placement of drainage catheter of Appendix |
| 42706-2 | US Guidance for injection of Pleural space |
| 42707-0 | US Heart limited |
| 42708-8 | NM Whole body Views W In-111 tiuxetan IV |
| 42709-6 | NM Liver Blood pool |
| 42710-4 | XR Cervical spine Limited Views |
| 42711-2 | NM Whole body Views W In-111 tagged WBC IV |
| 42776-5 | NM Unspecified body region Views for AV shunt |
| 42811-0 | XR Wrist - right scaphoid single view |
| 42812-8 | XR Wrist scaphoid single view |
| 42813-6 | XR Wrist - bilateral scaphoid single view |
| 42814-4 | XR Wrist - left scaphoid single view |
| 43444-9 | CT Guidance for percutaneous drainage of abscess and placement of drainage catheter of Unspecified body region |
| 43445-6 | CT Pulmonary system |
| 43448-0 | MR Liver WO and W ferumoxides IV |
| 43449-8 | MR Ankle - right dynamic W contrast IV |
| 43450-6 | MR Elbow - left dynamic W contrast IV |
| 43451-4 | MR Elbow - right dynamic W contrast IV |
| 43452-2 | MR Knee - left dynamic W contrast IV |
| 43453-0 | MR Knee - right dynamic W contrast IV |
| 43454-8 | MR Pulmonary system |
| 43455-5 | MR Oropharynx |
| 43456-3 | MR Cervical and thoracic spine WO and W contrast IV |
| 43457-1 | MR Cervical and thoracic spine |
| 43458-9 | MRA Orbit vessels WO and W contrast IV |
| 43459-7 | NM Brain Views during electroconvulsive shock treatment |
| 43461-3 | NM Kidney Views W furosemide IV |
| 43463-9 | XR Chest PA and Abdomen Supine and Upright |
| 43466-2 | XR Chest AP right lateral-decubitus |
| 43467-0 | XR Chest 2 Views and Right oblique and Left oblique |
| 43468-8 | XR Unspecified body region Views |
| 43469-6 | XR Unspecified body region Views for foreign body |
| 43470-4 | XR Skull LE 3 Views |
| 43471-2 | RF 2 hour |
| 43472-0 | RF 90 minutes |
| 43473-8 | RF Guidance for endoscopy of Biliary ducts and Pancreatic duct-- 2H post contrast retrograde intrabiliary |
| 43474-6 | RF Guidance for endoscopy of Biliary ducts and Pancreatic duct-- 15m post contrast retrograde intrabiliary |
| 43475-3 | RF Guidance for endoscopy of Biliary ducts and Pancreatic duct-- 30M post contrast retrograde intrabiliary |
| 43476-1 | RF Guidance for endoscopy of Biliary ducts and Pancreatic duct-- 45M post contrast retrograde intrabiliary |
| 43477-9 | RF Guidance for endoscopy of Biliary ducts and Pancreatic duct-- 1H post contrast retrograde intrabiliary |
| 43478-7 | RF Guidance for endoscopy of Biliary ducts and Pancreatic duct-- 1.5 hours post contrast retrograde intrabiliary |
| 43479-5 | RFA Abdominal Aorta Runoff W contrast IA |
| 43480-3 | XR Joint Lateral Views W manual stress |
| 43481-1 | XR Joint Views W flexion and W extension |
| 43482-9 | XR Knee - right GE 3 Views |
| 43483-7 | XR Foot - right 3 or 4 Views |
| 43485-2 | XR Kidney Views during surgery W contrast retrograde |
| 43486-0 | XR Sinuses GE 3 Views |
| 43487-8 | US Guidance for placement of radiation therapy fields in Unspecified body region |
| 43488-6 | XR Thumb - left GE 3 Views |
| 43489-4 | XR Finger second - left GE 3 Views |
| 43490-2 | XR Finger third - left GE 3 Views |
| 43491-0 | XR Finger fourth - left GE 3 Views |
| 43492-8 | XR Finger fifth - left GE 3 Views |
| 43493-6 | XR Thumb - right GE 3 Views |
| 43494-4 | XR Finger second - right GE 3 Views |
| 43495-1 | XR Finger third - right GE 3 Views |
| 43496-9 | XR Finger fourth - right GE 3 Views |
| 43497-7 | XR Finger fifth - right GE 3 Views |
| 43498-5 | XR Knee - left GE 3 Views |
| 43499-3 | XR Foot - left 3 or 4 Views |
| 43500-8 | NM Vessel Views for blood flow |
| 43501-6 | NM Vessel Views |
| 43502-4 | CT Guidance for drainage of abscess and placement of drainage catheter of Subphrenic space |
| 43504-0 | MR Axilla - left W contrast IV |
| 43505-7 | MR Axilla - right W contrast IV |
| 43506-5 | MR Ovary - bilateral |
| 43507-3 | MR Thymus gland |
| 43508-1 | MR Axilla - left |
| 43509-9 | MR Axilla - left WO and W contrast IV |
| 43510-7 | MR Axilla - right |
| 43511-5 | MR Axilla - right WO and W contrast IV |
| 43512-3 | MRA Lower leg vessels - bilateral W contrast IV |
| 43513-1 | MRA Lower leg vessels - left |
| 43514-9 | MRA Thigh vessels - left WO contrast |
| 43515-6 | MRA Thigh vessels - right WO contrast |
| 43516-4 | MRA Wrist vessels - left WO contrast |
| 43517-2 | MRA Wrist vessels - right WO contrast |
| 43518-0 | XR Bones Survey Views |
| 43519-8 | XR Bones Limited Survey Views |
| 43521-4 | XR Mandible 1 or 2 Views |
| 43522-2 | XR Pelvis 1 or 2 Views |
| 43523-0 | XR Sinuses 1 or 2 Views |
| 43524-8 | XR Skull GE 5 Views |
| 43525-5 | CT Unspecified body region WO contrast |
| 43526-3 | SPECT Unspecified body region |
| 43528-9 | MR Breast - unilateral WO and W contrast IV |
| 43529-7 | XR Orbit and Facial bones Views |
| 43530-5 | MR Orbit and Face and Neck |
| 43532-1 | XR Chest PA and Abdomen Upright |
| 43536-2 | RF videography Lumbar spine Views |
| 43537-0 | RF Guidance for drainage and placement of drainage catheter of Unspecified body region |
| 43538-8 | RF videography Cervical spine Views |
| 43539-6 | XR Cervical spine 2 or 3 Views |
| 43543-8 | XR Pelvis GE 3 Views |
| 43550-3 | NM Brain Views for blood flow and function |
| 43552-9 | US Carotid arteries - unilateral |
| 43554-5 | RFA Vessels - left Views W contrast IV |
| 43555-2 | MR Ankle - left dynamic W contrast IV |
| 43556-0 | MRA Lower leg vessels - right |
| 43557-8 | NM Liver and Biliary ducts and Gallbladder Views |
| 43558-6 | RF Guidance for change of dialysis catheter in Unspecified body region-- W contrast IV |
| 43559-4 | RF Urinary bladder and Urethra Views W contrast intra bladder during voiding |
| 43561-0 | XR Chest AP and Abdomen Upright |
| 43562-8 | NM Skeletal system.axial Views for bone density |
| 43563-6 | NM Skeletal system.peripheral Views for bone density |
| 43564-4 | US Guidance for superficial biopsy of Muscle |
| 43565-1 | US Guidance for deep biopsy of Bone |
| 43566-9 | US Hip and Thigh |
| 43567-7 | CT Guidance for deep biopsy of Bone |
| 43569-3 | XR Thoracic and lumbar spine AP Views for scoliosis upright and supine |
| 43570-1 | Portable XR Hand Views |
| 43572-7 | US.doppler Abdominal vessels limited |
| 43574-3 | RF Upper gastrointestinal tract and Small bowel Views W barium contrast PO |
| 43641-0 | XR Foot sesamoid bones - left Views |
| 43642-8 | NM Brain Views for blood flow W Tc-99m DTPA IV |
| 43643-6 | NM Brain Views for blood flow W Tc-99m glucoheptonate IV |
| 43644-4 | NM Brain Limited Views for blood flow |
| 69231-9 | NM Heart Views W stress and W Tc-99m IV |
| 69232-7 | NM Heart Views W stress and W Tc-99m Sestamibi IV |
| 43648-5 | NM Unspecified body region Views for endocrine tumor multiple areas W I-131 MIBG IV |
| 43649-3 | NM Unspecified body region Views for endocrine tumor multiple areas W In-111 pentetreotide IV |
| 43650-1 | NM Liver and Biliary ducts and Gallbladder Views W cholecystokinin and W radionuclide IV |
| 43651-9 | NM Liver and Biliary ducts and Gallbladder Views W sincalide and W radionuclide IV |
| 43652-7 | SPECT Liver and Spleen for blood flow |
| 43653-5 | NM Liver and Spleen Views for blood flow |
| 43654-3 | NM Liver Views for blood flow W Tc-99m tagged RBC IV |
| 43655-0 | SPECT Liver for blood flow |
| 43656-8 | NM Lung Perfusion quantitative |
| 43657-6 | NM Lung Quantitative Views |
| 44143-6 | NM Heart Views W Tc-99m tagged RBC IV |
| 43659-2 | SPECT Heart perfusion qualitative at rest and W radionuclide IV |
| 82800-4 | PET+CT Heart W contrast IV |
| 43662-6 | SPECT Renal vessels for blood flow W Tc-99m glucoheptonate IV |
| 43663-4 | NM Renal vessels Views for blood flow W Tc-99m glucoheptonate IV |
| 43664-2 | NM Renal vessels Views for blood flow W Tc-99m DTPA IV |
| 43665-9 | NM Renal vessels Views for blood flow W Tc-99m Mertiatide IV |
| 43666-7 | NM Kidney+Renal vessels Views for blood flow W Tc-99m glucoheptonate IV |
| 43667-5 | NM Kidney+Renal vessels Views W Tc-99m DTPA IV |
| 43669-1 | NM Renal vessels Views |
| 43670-9 | SPECT Spleen for blood flow |
| 43671-7 | NM Thyroid gland Spot |
| 43672-5 | NM Thyroid gland Views and Views uptake |
| 43673-3 | SPECT Thyroid gland for blood flow |
| 43756-6 | US Guidance for fluid aspiration of Breast |
| 43757-4 | CT Guidance for fine needle aspiration of Kidney |
| 43758-2 | US Guidance for localization of Breast - left |
| 43759-0 | US Guidance for localization of Breast - bilateral |
| 43760-8 | US Guidance for localization of Breast - right |
| 43761-6 | RFA Guidance for thrombectomy of Vein - bilateral-- W contrast IV |
| 43762-4 | RFA Guidance for thrombectomy of Vein - left-- W contrast IV |
| 43763-2 | RFA Guidance for thrombectomy of Vein-- W contrast IV |
| 43764-0 | RFA Guidance for thrombectomy of Vein - right-- W contrast IV |
| 43765-7 | US.doppler Carotid arteries - bilateral |
| 43766-5 | CT Kidney - bilateral W contrast IV |
| 43767-3 | CT Kidney - bilateral |
| 43768-1 | CT Kidney WO and W contrast IV |
| 43769-9 | MR Brain and Internal auditory canal WO and W contrast IV |
| 43770-7 | CT Kidney WO contrast |
| 43771-5 | US.doppler Extremity vessels |
| 43772-3 | MR Brain and Internal auditory canal |
| 43773-1 | MR Kidney WO contrast |
| 43774-9 | US Kidney - bilateral |
| 43775-6 | MR Kidney WO and W contrast IV |
| 43776-4 | US.doppler Iliac artery limited |
| 82801-2 | PET+CT Heart WO contrast |
| 43778-0 | Portable XR Chest AP supine |
| 43779-8 | XR Knee - left Sunrise |
| 43780-6 | XR Knee Sunrise |
| 43781-4 | XR Spine cervicothoracic junction Views |
| 43782-2 | RFA Iliac artery Views W contrast IA |
| 43783-0 | RFA Renal vein Views for renin sampling W contrast IV |
| 43784-8 | XR Cervical and thoracic and lumbar spine 2 Views |
| 43785-5 | XR Spine cervicothoracic junction AP and Lateral |
| 43787-1 | XR Skull and Facial bones and Mandible Views for dental measurement |
| 43788-9 | RF Tube Views for patency W contrast via tube |
| 43789-7 | NM Liver and Biliary ducts and Gallbladder Views for patency W Tc-99m IV |
| 43790-5 | XR Shoulder - right Grashey and Y |
| 43791-3 | XR Lumbar spine Oblique Views |
| 43792-1 | RFA Guidance for angioplasty of Tibioperoneal arteries - right-- W contrast IA |
| 43793-9 | RFA Guidance for angioplasty of Tibioperoneal arteries-- W contrast IA |
| 43794-7 | RFA Guidance for angioplasty of Tibioperoneal arteries - bilateral-- W contrast IA |
| 43795-4 | RFA Guidance for angioplasty of Tibioperoneal arteries - left-- W contrast IA |
| 43796-2 | XR Wrist - bilateral Carpal tunnel Views |
| 43797-0 | US Guidance for superficial biopsy of Lymph node |
| 44101-4 | CT Guidance for ablation of tissue of Liver |
| 44102-2 | CT Guidance for procedure of Joint space |
| 44103-0 | CT Guidance for fine needle aspiration of Lymph node |
| 44104-8 | CT Guidance for fine needle aspiration of Mediastinum |
| 44105-5 | CT Guidance for fine needle aspiration of Muscle |
| 44106-3 | CT Guidance for FNA of Prostate |
| 44107-1 | CT Guidance for fine needle aspiration of Retroperitoneum |
| 44108-9 | CT Guidance for fine needle aspiration of Adrenal gland |
| 44109-7 | CT Guidance for deep biopsy of Muscle |
| 44110-5 | CT Guidance for needle localization of Breast |
| 44111-3 | CT Skull base WO and W contrast IV |
| 44112-1 | CT Skull base WO contrast |
| 44113-9 | CT Thoracic spine WO and W contrast IT |
| 44114-7 | CT Lumbar spine WO and W contrast IT |
| 44115-4 | CT Abdomen and Pelvis |
| 44116-2 | CT Mandible limited |
| 44117-0 | CT Guidance for biopsy of Retroperitoneum |
| 44118-8 | CT Guidance for needle localization of Breast-- WO and W contrast IV |
| 44119-6 | CT Breast - bilateral WO contrast |
| 44122-0 | MR Guidance for stereotactic localization of Brain-- WO and W contrast IV |
| 44123-8 | MR Biliary ducts and Pancreatic duct WO contrast |
| 44124-6 | MR Adrenal gland W contrast IV |
| 44125-3 | MR Biliary ducts and Pancreatic duct W contrast IV |
| 44137-8 | PT Heart |
| 81564-7 | PT Heart for sarcoidosis |
| 44128-7 | MRA Lower extremity vessels WO and W contrast IV |
| 44129-5 | MRA Lower extremity vessels WO contrast |
| 44130-3 | MRA Aortic arch WO contrast |
| 44131-1 | MRA Thoracic and abdominal aorta WO and W contrast IV |
| 44132-9 | MRA Thoracic and abdominal aorta WO contrast |
| 44133-7 | MRA Renal vessels WO contrast |
| 44134-5 | MRA Renal vessels WO and W contrast IV |
| 44135-2 | MRA Lower extremity vessels - bilateral W contrast IV |
| 44136-0 | PT Unspecified body region |
| 81565-4 | PT Heart for tissue viability |
| 44138-6 | PT Brain |
| 44139-4 | PT Whole body |
| 44140-2 | NM Abdomen and Pelvis Views for tumor |
| 44141-0 | NM Liver and Spleen Views W Tc-99m MAA IV |
| 44142-8 | NM Bone Views W Tc-99m medronate IV |
| 81568-8 | PT perfusion Heart W multiple states of exercise |
| 44144-4 | NM Liver Views W Xe-133 IH |
| 44145-1 | NM Parathyroid gland Views W Tc-99m Sestamibi IV |
| 44146-9 | NM Bone marrow Views W Tc-99m SC IV |
| 44147-7 | NM Thyroid gland Views and Views uptake W Tc-99m pertechnetate IV |
| 44148-5 | NM Brain Views for blood flow W Tc-99m bicisate IV |
| 44149-3 | NM Abdomen and Pelvis Views for shunt patency W Tc-99m MAA inj |
| 44150-1 | NM Brain Views W Tc-99m bicisate IV |
| 44151-9 | SPECT Heart W Tc-99m Sestamibi IV |
| 81569-6 | PT perfusion Heart W single state of exercise |
| 44152-7 | SPECT Brain W Tc-99m bicisate IV |
| 44153-5 | SPECT Kidney W Tc-99m glucoheptonate IV |
| 44154-3 | SPECT Heart W dipyridamole and W Tc-99m Sestamibi IV |
| 44155-0 | US Guidance for ablation of tissue of Liver |
| 44156-8 | US Guidance for ablation of tissue of Kidney |
| 44157-6 | US Guidance for fine needle aspiration of Pancreas |
| 44158-4 | US Guidance for fine needle aspiration of Liver |
| 44159-2 | US Guidance for fine needle aspiration of Kidney |
| 44160-0 | US Guidance for fine needle aspiration of Breast |
| 44161-8 | US Guidance for biopsy of Lung |
| 44162-6 | US Guidance for biopsy of Retroperitoneum |
| 44163-4 | US Brachial plexus |
| 44164-2 | US Head and Neck |
| 44166-7 | US Guidance for drainage of abscess and placement of drainage catheter of Subphrenic space |
| 44167-5 | US Guidance for drainage of abscess and placement of drainage catheter of Kidney |
| 44168-3 | US Guidance for drainage of abscess and placement of drainage catheter of Pelvis |
| 44169-1 | US Guidance for drainage of abscess and placement of drainage catheter of Peritoneal space |
| 44172-5 | US Guidance for drainage and placement of drainage catheter of Pancreas |
| 44173-3 | US Extremity artery limited |
| 44174-1 | US.doppler Lower extremity vessels |
| 44175-8 | US.doppler Neck vessels |
| 44176-6 | Portable XR Hip Single view |
| 44177-4 | XR Lower extremity - bilateral AP W standing |
| 44178-2 | XR Lumbar spine oblique and (views W right bending and W left bending) |
| 44179-0 | XR Sacrum and Coccyx 2 Views |
| 44181-6 | XR Sacroiliac Joint 2 or 3 Views |
| 44182-4 | Portable XR Hand 2 Views |
| 44183-2 | Portable XR Radius and Ulna 2 Views |
| 44184-0 | Portable XR Elbow 2 Views |
| 44185-7 | Portable XR Femur AP and Lateral |
| 44186-5 | Portable XR Foot AP and Lateral |
| 44187-3 | Portable XR Cervical spine AP and Oblique and Odontoid and (Lateral W flexion and W extension) |
| 44188-1 | XR Foot GE 3 Views |
| 44189-9 | XR Sacroiliac Joint GE 3 Views |
| 44190-7 | XR Wrist GE 3 Views |
| 44191-5 | XR Ribs GE 3 Views and Chest PA |
| 44192-3 | Portable XR Pelvis GE 3 Views |
| 44193-1 | Portable XR Hand GE 3 Views |
| 44194-9 | XR Spine GE 4 Views W right bending and W left bending |
| 44195-6 | XR Knee GE 5 Views |
| 44196-4 | XR Lumbar spine GE 5 Views W right bending and W left bending |
| 44197-2 | XR Knee - bilateral GE 5 Views W standing |
| 44198-0 | XR Knee 1 or 2 Views |
| 44199-8 | XR Facial bones 1 or 2 Views |
| 44201-2 | Portable XR Pelvis 1 or 2 Views |
| 44202-0 | Portable XR Knee 1 or 2 Views |
| 44203-8 | Portable XR Cervical and thoracic and lumbar spine Views |
| 44205-3 | XR Lower extremity - bilateral Single view W standing |
| 44206-1 | XR Thoracic and lumbar spine for scoliosis single view |
| 44208-7 | XR Orbit Views for foreign body |
| 44209-5 | XR Sinuses Limited Views |
| 44210-3 | XR Ankle GE 3 Views |
| 44211-1 | XR Chest GE 4 Views |
| 44212-9 | XR Cervical spine GE 4 Views |
| 44213-7 | RF Guidance for endoscopy of Pancreatic duct-- W contrast retrograde |
| 44214-5 | RF Guidance for endoscopy of Biliary ducts-- W contrast retrograde |
| 44215-2 | RF Guidance for fine needle aspiration of Unspecified body region |
| 44216-0 | RF Guidance for fine needle aspiration of Thyroid gland |
| 44217-8 | RF Guidance for fine needle aspiration of Kidney |
| 44218-6 | RF Guidance for fine needle aspiration of Pancreas |
| 44219-4 | RFA Guidance for fine needle aspiration of Lymph node |
| 44220-2 | RF Guidance for fine needle aspiration of Liver |
| 44221-0 | RF Guidance for deep aspiration.fine needle of Tissue |
| 44222-8 | RF Guidance for procedure of Joint space |
| 44223-6 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Ovary |
| 44224-4 | RF Guidance for placement of tube in Unspecified body region |
| 44225-1 | RF Guidance for biopsy of Liver-- W contrast IV |
| 44226-9 | RF Colon Views for reduction W barium contrast PR |
| 44227-7 | RF Colon Views W barium contrast PR |
| 44228-5 | CT Guidance for ablation of tissue of Kidney |
| 44229-3 | CT Bone |
| 44230-1 | MRA Superior mesenteric vessels WO contrast |
| 44231-9 | MRA Superior mesenteric vessels WO and W contrast IV |
| 44232-7 | NM Kidney Views WO and W Tc-99m Mertiatide IV |
| 44233-5 | NM Kidney Views WO and W Tc-99m DTPA IV |
| 44234-3 | NM Kidney Views W Tc-99m glucoheptonate IV |
| 44235-0 | US.doppler Superior mesenteric vessels |
| 44236-8 | US.doppler Upper extremity vessel - bilateral for graft |
| 44237-6 | US.doppler Upper extremity vessel - bilateral for graft limited |
| 44238-4 | XR Trachea Views |
| 44239-2 | Portable XR Ribs - unilateral GE 3 Views and Chest PA |
| 44240-0 | RFA Peripheral arteries - bilateral Views W contrast IA |
| 46281-2 | CT Guidance for aspiration or injection of cyst of Unspecified body region |
| 46282-0 | US Guidance for aspiration or injection of cyst of Unspecified body region |
| 46283-8 | MG Guidance for fine needle aspiration of Breast - right |
| 46284-6 | MG Guidance for fine needle aspiration of Breast - left |
| 46285-3 | US Guidance for core needle biopsy of Thyroid gland |
| 46288-7 | US Guidance for biopsy of Prostate |
| 46289-5 | CT Guidance for biopsy of Unspecified body region-- WO and W contrast IV |
| 46290-3 | CT Guidance for biopsy of Unspecified body region-- WO contrast |
| 46291-1 | CT Guidance for drainage and placement of drainage catheter of Unspecified body region-- WO and W contrast IV |
| 46292-9 | CT Guidance for drainage and placement of drainage catheter of Unspecified body region-- W contrast IV |
| 46293-7 | CT Guidance for drainage and placement of drainage catheter of Unspecified body region-- WO contrast |
| 46294-5 | RF Guidance for percutaneous replacement of drainage catheter of Stomach |
| 46295-2 | MG stereo Guidance for percutaneous biopsy.core needle of Breast - left |
| 46296-0 | MG stereo Guidance for percutaneous biopsy.core needle of Breast |
| 46297-8 | SPECT Whole body |
| 46298-6 | CT Mastoid - bilateral |
| 46299-4 | MR Breast - unilateral |
| 46301-8 | US.doppler Extremity vein - bilateral limited |
| 46302-6 | US.doppler Upper extremity artery - bilateral limited |
| 46303-4 | US.doppler Upper extremity vessels limited |
| 46304-2 | CT Sinuses limited WO contrast |
| 46305-9 | CT Whole body |
| 46306-7 | CT Whole body W contrast IV |
| 46307-5 | CTA Lower extremity vessels - right WO and W contrast IV |
| 46308-3 | CTA Lower extremity vessels - left WO and W contrast IV |
| 46309-1 | CTA Upper extremity vessels - right WO and W contrast IV |
| 46310-9 | MR Orbit and Face and Neck WO and W contrast IV |
| 46311-7 | CT Parotid gland WO and W contrast IV |
| 46312-5 | CTA Upper extremity vessels - left WO and W contrast IV |
| 46313-3 | CT Pelvis WO and W reduced contrast volume IV |
| 46314-1 | CT Internal auditory canal WO and W reduced contrast volume IV |
| 46315-8 | CT Maxillofacial region WO and W reduced contrast volume IV |
| 46316-6 | CT Head WO and W reduced contrast volume IV |
| 46317-4 | CT Chest WO and W reduced contrast volume IV |
| 46318-2 | CT Abdomen WO and W reduced contrast volume IV |
| 46319-0 | MR Elbow Arthrogram |
| 46320-8 | CT Orbit and Face W contrast IV |
| 46321-6 | MR Orbit and Face and Neck W contrast IV |
| 46322-4 | CT Kidney W contrast IV |
| 46323-2 | MR Breast - unilateral W contrast IV |
| 46324-0 | MRA Lower extremity vessels W contrast IV |
| 46325-7 | CT Internal auditory canal W reduced contrast volume IV |
| 46326-5 | CT Maxillofacial region W reduced contrast volume IV |
| 46327-3 | CT Chest W reduced contrast volume IV |
| 46328-1 | CT Head W reduced contrast volume IV |
| 46329-9 | CT Pelvis W reduced contrast volume IV |
| 46330-7 | CT Abdomen W reduced contrast volume IV |
| 46331-5 | CT Orbit WO contrast |
| 46332-3 | MR Orbit and Face and Neck WO contrast |
| 46333-1 | MR Breast - unilateral WO contrast |
| 46335-6 | MG Breast - bilateral Single view |
| 46336-4 | MG Breast - left Single view |
| 46337-2 | MG Breast - right Single view |
| 46338-0 | MG Breast - unilateral Single view |
| 46339-8 | MG Breast - unilateral Views |
| 46340-6 | XR Spine lumbosacral junction Views |
| 46341-4 | RF Abdomen Views |
| 46342-2 | FFD mammogram Breast Views |
| 46343-0 | XR Wrist - right GE 3 Views |
| 46344-8 | XR Elbow - left GE 3 Views |
| 46345-5 | XR Elbow - right GE 3 Views |
| 46346-3 | XR Wrist - left GE 3 Views |
| 46347-1 | XR Ankle - right GE 3 Views |
| 46348-9 | XR Chest GE 2 and PA and Lateral |
| 46349-7 | XR Shoulder - bilateral AP and Transthoracic |
| 46350-5 | MG Breast - unilateral Diagnostic |
| 46351-3 | MG Breast - bilateral Displacement Views for Implant |
| 46352-1 | MG Breast duct Views during surgery W contrast intra duct |
| 46354-7 | FFD mammogram Breast - right Screening |
| 46355-4 | FFD mammogram Breast - left Screening |
| 46356-2 | MG Breast - unilateral Screening |
| 46357-0 | RF Colon Views W air contrast PR |
| 46358-8 | MR Whole body |
| 46359-6 | MRA Superior mesenteric vessels |
| 46360-4 | MRA Aortic arch WO and W contrast IV |
| 46361-2 | NM Lung Ventilation W Xe-133 IH |
| 46362-0 | US.doppler Foot vessels |
| 46363-8 | US Lower extremity vein |
| 46364-6 | US Lower extremity vein - bilateral |
| 46365-3 | CT Guidance for ablation of tissue of Celiac plexus |
| 46366-1 | SPECT guidance for percutaneous biopsy of Bone |
| 46369-5 | US Guidance for biopsy of Ovary |
| 46370-3 | US Guidance for biopsy of Pelvis |
| 46371-1 | XR Guidance for change of percutaneous tube in Unspecified body region-- W contrast |
| 46372-9 | RF Guidance for percutaneous drainage and placement of drainage catheter of Biliary ducts |
| 46373-7 | SPECT Guidance for placement of tube in Chest |
| 46374-5 | US Cerebral arteries |
| 46375-2 | US Artery |
| 46376-0 | RF Kidney - bilateral Views W contrast antegrade |
| 46377-8 | XR Skull GE 3 Views |
| 46378-6 | XR Knee - bilateral PA Views W standing and W flexion |
| 46379-4 | US.doppler Upper extremity vessels - bilateral |
| 46380-2 | MG Breast - unilateral Views for implant |
| 46381-0 | XR Elbow and Radius and Ulna Views |
| 46382-8 | US.doppler Hand vessels |
| 46384-4 | SPECT Guidance for superficial biopsy of Bone |
| 46385-1 | US.doppler Upper extremity vessel for graft |
| 46386-9 | XR Teeth Bitewing Views |
| 46387-7 | MG Guidance for fine needle aspiration of Breast |
| 46388-5 | US.doppler Thoracic and abdominal aorta |
| 46389-3 | XR Elbow - bilateral Views and Radial head capitellar |
| 46390-1 | XR Ankle - left GE 3 Views |
| 46391-9 | Portable XR Shoulder Views |
| 46392-7 | RF Guidance for injection of Sinuses |
| 46393-5 | CT Liver W Xe-133 IH |
| 46395-0 | SPECT Heart gated and ejection fraction at rest and W stress and W radionuclide IV |
| 46396-8 | SPECT Heart gated at rest and W Tc-99m Sestamibi IV |
| 47366-0 | CT Chest limited WO contrast |
| 47367-8 | XR and RF Chest GE 4 Views and Views |
| 47368-6 | XR Chest GE 4 and PA and Lateral |
| 47370-2 | XR Hand - left GE 3 Views |
| 47371-0 | XR Hand - right GE 3 Views |
| 47372-8 | XR Hip Views during surgery |
| 47373-6 | XR Knee - left 1 or 2 Views |
| 47374-4 | XR Knee - left GE 4 Views |
| 47375-1 | XR Knee - right 1 or 2 Views |
| 47376-9 | XR Knee - right GE 4 Views |
| 47377-7 | XR Knee - right LE 4 Views |
| 47378-5 | SPECT Liver blood pool |
| 47379-3 | XR Mandible GE 4 Views |
| 47380-1 | XR Mandible LE 3 Views |
| 47381-9 | XR Mastoid GE 3 Views |
| 47382-7 | XR Lumbar spine GE 4 Views |
| 47983-2 | XR Mastoid - bilateral 1 or 2 Views |
| 47984-0 | XR Pelvis and Spine Lumbar Views |
| 47985-7 | CT Spine W contrast IT |
| 47986-5 | RFA Lower extremity arteries - left Views W contrast IA |
| 47987-3 | RFA Lower extremity arteries - right Views W contrast IA |
| 48433-7 | XR Calcaneus - bilateral 2 Views |
| 48434-5 | US Guidance for fluid aspiration of Kidney |
| 48435-2 | RF Guidance for injection of Salivary gland - bilateral |
| 48436-0 | MR Lumbar spine W contrast IT |
| 48439-4 | MR Thoracic spine W contrast IT |
| 48440-2 | MR Skull base W contrast IV |
| 48441-0 | MR Thoracic spine WO and W contrast IT |
| 48442-8 | CT Spine WO and W contrast IT |
| 48443-6 | CT Nasopharynx WO and W contrast IV |
| 48444-4 | MR Brain.temporal W contrast IV |
| 48445-1 | MR Larynx WO contrast |
| 48446-9 | CT Nasopharynx W contrast IV |
| 48447-7 | MR Cervical spine W contrast IT |
| 48448-5 | US Upper extremity artery |
| 48449-3 | CT Orbit W contrast IV |
| 48450-1 | MR Cervical spine WO and W contrast IT |
| 48451-9 | CT Orbit WO and W contrast IV |
| 48452-7 | MR Lumbar spine WO and W contrast IT |
| 48453-5 | MR Brain.temporal WO contrast |
| 48454-3 | MR Clavicle - right WO and W contrast IV |
| 48455-0 | MR Clavicle - left WO and W contrast IV |
| 48456-8 | MR Clavicle - right W contrast IV |
| 48457-6 | MR Clavicle - left W contrast IV |
| 48458-4 | MR Clavicle - right WO contrast |
| 48459-2 | MR Clavicle - left WO contrast |
| 48460-0 | MR Unspecified body region limited |
| 48461-8 | MR Neck limited |
| 48462-6 | XR Knee - left AP |
| 48463-4 | XR Knee - right AP |
| 48464-2 | RF Trachea Views |
| 48465-9 | RF Larynx Views |
| 48466-7 | XR Skull Limited Views |
| 48467-5 | XR Sacroiliac Joint 1 or 2 Views |
| 48468-3 | XR Ribs - bilateral 2 Views and Chest PA |
| 48469-1 | XR Lumbar spine 2 or 3 Views |
| 48470-9 | XR Mastoid - left 3 Views |
| 48471-7 | XR Mastoid - right 3 Views |
| 48472-5 | XR Thoracic spine 3 Views and Swimmers |
| 48473-3 | XR Spine Lumbar and Sacrum 4 Views |
| 48474-1 | XR Hand - bilateral AP and Lateral |
| 48475-8 | MG Breast - bilateral Diagnostic for implant |
| 48476-6 | XR Foot - right GE 3 Views |
| 48477-4 | XR Foot - left GE 3 Views |
| 48478-2 | XR Foot - bilateral GE 3 Views |
| 48479-0 | XR Facial bones GE 3 Views |
| 48480-8 | XR Ankle - bilateral GE 3 Views |
| 48481-6 | XR Elbow - bilateral GE 3 Views |
| 48482-4 | XR Sternoclavicular joint - bilateral GE 3 Views |
| 48483-2 | XR Wrist - bilateral GE 3 Views |
| 48484-0 | XR Ribs - right GE 3 Views and Chest PA |
| 48485-7 | XR Ribs - bilateral GE 3 Views and Chest PA |
| 48486-5 | XR Ribs - left GE 3 Views and Chest PA |
| 48487-3 | XR Skull GE 4 Views |
| 48488-1 | XR Mastoid - right 1 or 2 Views |
| 48489-9 | XR Mastoid - left 1 or 2 Views |
| 48490-7 | XR Temporomandibular joint - right Open and Closed mouth |
| 48491-5 | XR Temporomandibular joint - left Open and Closed mouth |
| 48492-3 | MG Breast - bilateral Screening for implant |
| 48687-8 | MR Skull base WO contrast |
| 48688-6 | US Upper extremity vein - right |
| 48689-4 | US Upper extremity vein - left |
| 48690-2 | US Upper extremity vein - bilateral |
| 48691-0 | US Lower extremity vein - right |
| 48692-8 | US Lower extremity vein - left |
| 48693-6 | US Lower extremity artery |
| 48694-4 | MR Brain.temporal WO and W contrast IV |
| 48695-1 | XR Skull base Single view |
| 48696-9 | RF Submandibular gland - right Views W contrast intra salivary duct |
| 48697-7 | XR Skull base Views |
| 48698-5 | RF Submandibular gland - bilateral Views W contrast intra salivary duct |
| 48699-3 | XR Temporomandibular joint - unilateral Open and Closed mouth |
| 48735-5 | MG Guidance for localization of Breast |
| 48736-3 | MG Guidance for sentinel lymph node injection of Breast - left |
| 48737-1 | XR Wrist and Hand 3 Views |
| 48738-9 | XR Wrist - bilateral and Hand - bilateral 3 Views |
| 48739-7 | MG Guidance for sentinel lymph node injection of Breast - right |
| 48740-5 | MG Guidance for sentinel lymph node injection of Breast |
| 48742-1 | US.doppler Scrotum and testicle |
| 48743-9 | CT Retroperitoneum WO and W contrast IV |
| 48746-2 | XR Sacroiliac joint - bilateral GE 3 Views |
| 48747-0 | XR Orbit - bilateral GE 4 Views |
| 48748-8 | XR Spine Oblique Views |
| 48749-6 | XR Thoracic spine Oblique Views |
| 49118-3 | NM Unspecified body region Views |
| 49507-7 | MR Unspecified body region W contrast IV |
| 49509-3 | MG Breast duct - right Single view W contrast intra duct |
| 49510-1 | MG Breast duct - left Single view W contrast intra duct |
| 49511-9 | RFA Femoral artery Runoff WO and W contrast IA |
| 49512-7 | RF Unspecified body region Views |
| 49565-5 | MRA Thoracic spine vessels |
| 49566-3 | SPECT Heart at rest and W Tc-99m Sestamibi IV |
| 49567-1 | SPECT Heart perfusion W adenosine and W Tc-99m Sestamibi IV |
| 49568-9 | SPECT Heart perfusion at rest and W stress and W Tl-201 IV and W Tc-99m Sestamibi IV |
| 49569-7 | SPECT Heart perfusion and wall motion at rest and W stress and W Tl-201 IV and W Tc-99m Sestamibi IV |
| 49570-5 | XR Ankle - bilateral GE 6 Views |
| 49571-3 | NM Unspecified body region Limited Views W I-131 MIBG IV |
| 50755-8 | CT Lower extremity - bilateral W contrast IV |
| 51387-9 | XR Knee - bilateral Views and (AP W standing) |
| 51388-7 | XR Wrist - right and Hand - right Views |
| 51389-5 | NM Breast Views W Tl-201 IV |
| 51391-1 | RFA Guidance for placement of TIPS of Portal vein and Hepatic vein |
| 51392-9 | XR Wrist - left and Hand - left Views |
| 51394-5 | XR Ankle and Foot - right Views |
| 51395-2 | XR Ankle and Foot - left Views |
| 52790-3 | CT Guidance for percutaneous replacement of drainage catheter of Abdomen |
| 52791-1 | CT Guidance for percutaneous replacement of drainage catheter of Pelvis |
| 57822-9 | PT Lung |
| 57823-7 | PT Esophagus |
| 58740-2 | MRCP Abdomen WO contrast |
| 58741-0 | PT Skull base to mid-thigh |
| 58742-8 | PT Head and Neck |
| 58743-6 | US Guidance for ablation of tissue of Unspecified body region |
| 58746-9 | RFA AV fistula Views W contrast IV |
| 58747-7 | CT Guidance for ablation of tissue of Unspecified body region |
| 58748-5 | Functional MR Brain |
| 60515-4 | CT Colon and Rectum W air contrast PR |
| 60527-9 | NM Thyroid gland Views and Views uptake W I-123 PO |
| 62446-0 | RFA Renal artery - left Views W contrast IA |
| 62447-8 | RFA Renal artery - right Views W contrast IA |
| 62448-6 | RFA Head artery - left and Neck artery - left Views W contrast IA |
| 62449-4 | RFA Head artery - right and Neck artery - right Views W contrast IA |
| 62450-2 | RF Guidance for placement of catheter in Peritoneum |
| 62451-0 | US Extremity - left limited |
| 62452-8 | US Extremity - right limited |
| 62491-6 | RFA Guidance for placement of prosthesis in Iliac artery - left-- W contrast IA |
| 62492-4 | RFA Guidance for placement of prosthesis in Iliac artery - right-- W contrast IA |
| 62494-0 | US Guidance for percutaneous drainage and placement of drainage catheter of Unspecified body region |
| 64051-6 | NM Breast lymphatic vessels - left Views W radionuclide intra lymphatic |
| 64052-4 | NM Breast lymphatic vessels - right Views W radionuclide intra lymphatic |
| 64140-7 | RFA Renal vessels - left Views W contrast |
| 64141-5 | RFA Renal vessels - right Views W contrast |
| 64993-9 | US Guidance for placement of needle in Unspecified body region |
| 64995-4 | RFA Internal thoracic artery - left Views W contrast IA |
| 64996-2 | XR Lung - left Views W contrast intrabronchial |
| 64997-0 | XR Lung - right Views W contrast intrabronchial |
| 64998-8 | RF Guidance for placement of catheter in Fallopian tube - left-- transcervical |
| 64999-6 | RF Guidance for placement of catheter in Fallopian tube - right-- transcervical |
| 65000-2 | RFA Internal thoracic artery - right Views W contrast IA |
| 65797-3 | RFA Guidance for placement of stent in Artery - left |
| 65798-1 | RFA Guidance for placement of stent in Artery - right |
| 65799-9 | RF Kidney - bilateral Single view for cyst |
| 65800-5 | RF Kidney - left Single view for cyst |
| 65801-3 | RF Kidney - right Single view for cyst |
| 69054-5 | RFA Aortic arch Views W contrast IA |
| 69055-2 | XR Acromioclavicular joint - bilateral Views WO weight |
| 69056-0 | XR Elbow - bilateral Views and Obliques |
| 69057-8 | XR Hand - bilateral AP and Lateral and oblique |
| 69058-6 | XR Hip - bilateral 2 Views |
| 69059-4 | XR Hip - bilateral Views and Lateral crosstable |
| 69060-2 | XR Knee - bilateral 2 Views and Sunrise |
| 69061-0 | XR Knee - bilateral 2 Views and Tunnel |
| 69062-8 | XR Knee - bilateral 4 Views W standing |
| 69063-6 | XR Knee - bilateral 4 Views and Sunrise and Tunnel |
| 69064-4 | XR Knee - bilateral Sunrise and (Views W standing) |
| 69065-1 | XR Abdomen AP and Lateral crosstable |
| 69066-9 | RFA Abdominal vessels Views W contrast IV |
| 69067-7 | RFA Guidance for angioplasty of Unspecified body region-- W contrast |
| 69068-5 | MG Guidance for needle localization of Breast - bilateral |
| 69069-3 | XR Patella - bilateral Sunrise |
| 69070-1 | XR Ribs - bilateral Anterior and Lateral |
| 69071-9 | XR Ribs - bilateral and Chest Views |
| 69072-7 | XR Wrist - bilateral Ulnar deviation and Radial deviation |
| 69073-5 | RF Guidance for core needle biopsy of Unspecified body region |
| 69074-3 | RF Guidance for biopsy of Pelvis |
| 69075-0 | RF Guidance for biopsy of Salivary gland |
| 69076-8 | RF guidance for percutaneous biopsy of Bone |
| 69077-6 | RFA Brachiocephalic artery Views W contrast IA |
| 69078-4 | RF Guidance for drainage and placement of drainage catheter of Chest |
| 69079-2 | XR Clavicle 45 degree cephalic angle |
| 69080-0 | XR Cervical spine 5 Views W flexion and W extension |
| 69081-8 | XR Cervical spine 5 Views and Swimmers |
| 69083-4 | CT Guidance for biopsy of Abdomen-- WO contrast |
| 69084-2 | CTA Chest vessels WO contrast |
| 69087-5 | CT Ankle - bilateral WO contrast |
| 69088-3 | CT Knee - bilateral W contrast IV |
| 69089-1 | CT Knee - bilateral WO contrast |
| 69090-9 | CT Shoulder - bilateral WO contrast |
| 69091-7 | CT Wrist - bilateral W contrast IV |
| 69092-5 | CT Guidance for biopsy of Liver-- WO contrast |
| 69093-3 | CT Guidance for biopsy of Pelvis-- W contrast IV |
| 69094-1 | CT Guidance for biopsy of Pelvis-- WO contrast |
| 69095-8 | CT Urinary bladder W contrast IV |
| 69096-6 | CT Chest limited W contrast IV |
| 69102-2 | CT Ankle - left Arthrogram |
| 69103-0 | CT Elbow - left Arthrogram |
| 69104-8 | CT Extremity - left WO contrast |
| 69105-5 | CT Hip - left Arthrogram |
| 69106-3 | CT Knee - left Arthrogram |
| 69107-1 | CT Wrist - left Arthrogram |
| 69109-7 | CT Ankle - right Arthrogram |
| 69110-5 | CT Elbow - right Arthrogram |
| 69111-3 | CT Extremity - right WO contrast |
| 69112-1 | CT Hip - right Arthrogram |
| 69113-9 | CT Kidney - right |
| 69114-7 | CT Knee - right Arthrogram |
| 69115-4 | CT Wrist - right Arthrogram |
| 69116-2 | CT Sacrum and Coccyx |
| 69117-0 | CT Scapula |
| 69118-8 | CT Scapula WO contrast |
| 69119-6 | CTA Thoracic Aorta WO contrast |
| 69120-4 | RF Guidance for drainage of abscess and placement of drainage catheter of Neck |
| 69121-2 | RF Guidance for aspiration of cyst of Ovary |
| 69122-0 | RF Guidance for drainage of abscess and placement of drainage catheter of Pancreas |
| 69123-8 | RF Guidance for drainage of abscess and placement of chest tube of Pleural space |
| 69124-6 | RF Guidance for superficial aspiration.fine needle of Tissue |
| 69127-9 | RF Guidance for biopsy of Chest Pleura |
| 69129-5 | RF Guidance for biopsy of Thyroid gland |
| 69130-3 | XR Hand AP and Lateral |
| 69131-1 | XR Hip Views and Danelius Miller |
| 69132-9 | XR Hip Danelius Miller |
| 69133-7 | RF Guidance for drainage and placement of drainage catheter of Hip |
| 69134-5 | RFA Guidance for placement of stent in Iliac artery |
| 69135-2 | RFA Guidance for atherectomy of Iliac artery-- W contrast |
| 69136-0 | XR Knee Sunrise and Tunnel |
| 69137-8 | XR Ankle - left AP and Lateral and oblique W standing |
| 69138-6 | XR Ankle - left 3 Views W standing |
| 69139-4 | XR Hip - left Views and Lateral crosstable |
| 69140-2 | XR Hip - left Views and Danelius Miller |
| 69141-0 | XR Hip - left Danelius Miller |
| 69142-8 | XR Knee - left 2 Views and Sunrise |
| 69143-6 | XR Knee - left 2 views and (Tunnel W standing) |
| 69144-4 | XR Knee - left 4 views and (AP W standing) |
| 69145-1 | XR Knee - left 4 views and Tunnel |
| 69146-9 | XR Knee - left AP and Lateral crosstable |
| 69147-7 | XR Knee - left AP and Lateral and Right oblique and Left oblique |
| 69148-5 | XR Knee - left Views and Tunnel |
| 69149-3 | XR Knee - left Sunrise and (Views W standing) |
| 69150-1 | MG Breast - left Diagnostic for implant |
| 69151-9 | XR Wrist - left 3 Scaphoid Views |
| 69152-7 | XR Patella - left Single view |
| 69153-5 | XR Shoulder - left AP and Grashey and Axillary |
| 69154-3 | XR Shoulder - left 3 Views and Axillary |
| 69155-0 | XR Shoulder - left 3 Views and Y |
| 69156-8 | XR Shoulder - left Grashey and Y |
| 69157-6 | XR Wrist - left Lateral Views W flexion and W extension |
| 69158-4 | XR Breast Diagnostic for implant |
| 69159-2 | XR Breast Screening for implant |
| 69161-8 | MRA Circle of Willis WO and W contrast IV |
| 69162-6 | MRA Pulmonary artery - bilateral W contrast IA |
| 69163-4 | MR Ankle - bilateral W contrast IV |
| 69164-2 | MR Ankle - bilateral WO contrast |
| 69165-9 | MR Breast - bilateral for implant |
| 69166-7 | MR Breast - bilateral for implant WO and W contrast IV |
| 69167-5 | MR Breast - bilateral for implant W contrast IV |
| 69168-3 | MR Breast - bilateral for implant WO contrast |
| 69169-1 | MR Guidance for biopsy of Breast - bilateral |
| 69170-9 | MR Elbow - bilateral W contrast IV |
| 69171-7 | MR Elbow - bilateral WO contrast |
| 69172-5 | MR Femur - bilateral W contrast IV |
| 69173-3 | MR Femur - bilateral WO contrast |
| 69174-1 | MR Forearm - bilateral WO and W contrast IV |
| 69175-8 | MR Forearm - bilateral W contrast IV |
| 69176-6 | MR Forearm - bilateral WO contrast |
| 69177-4 | MR Hand - bilateral WO and W contrast IV |
| 69178-2 | MR Hand - bilateral W contrast IV |
| 69179-0 | MR Hand - bilateral WO contrast |
| 69180-8 | MR Upper arm - bilateral |
| 69181-6 | MR Upper arm - bilateral WO and W contrast IV |
| 69182-4 | MR Upper arm - bilateral W contrast IV |
| 69183-2 | MR Upper arm - bilateral WO contrast |
| 69184-0 | MR Shoulder - bilateral W contrast IV |
| 69185-7 | MR Lower leg - bilateral WO contrast |
| 69186-5 | MR Upper extremity - bilateral WO and W contrast IV |
| 69187-3 | MR Upper extremity - bilateral W contrast IV |
| 69188-1 | MR Upper extremity - bilateral WO contrast |
| 69189-9 | MR Breast for implant WO and W contrast IV |
| 69190-7 | MR Breast for implant W contrast IV |
| 69191-5 | MR Breast for implant WO contrast |
| 69192-3 | MR Guidance for aspiration of cyst of Breast |
| 69193-1 | MR Extremity |
| 69194-9 | MR Finger WO and W contrast IV |
| 69195-6 | MR Finger W contrast IV |
| 69196-4 | MR Finger WO contrast |
| 69197-2 | MR Guidance for biopsy of Liver |
| 69198-0 | MR Guidance for biopsy of Muscle |
| 69199-8 | MR Guidance for biopsy of Pancreas |
| 69200-4 | MR Guidance for biopsy of Chest Pleura |
| 69201-2 | MR Guidance for biopsy of Salivary gland |
| 69202-0 | MR Guidance for biopsy of Thyroid gland |
| 69203-8 | MR Guidance for biopsy of Breast - left |
| 69204-6 | MR Finger - left WO and W contrast IV |
| 69205-3 | MR Finger - left W contrast IV |
| 69206-1 | MR Finger - left WO contrast |
| 69207-9 | MR Hip - left Arthrogram WO and W contrast |
| 69208-7 | MR Shoulder - left Arthrogram WO and W contrast |
| 69209-5 | MR Wrist - left and Hand - left |
| 69210-3 | MR Lower Extremity Joint Arthrogram |
| 69211-1 | MR Nasal bones |
| 69212-9 | MR Pelvis limited |
| 69213-7 | MR Guidance for biopsy of Breast - right |
| 69214-5 | MR Finger - right WO and W contrast IV |
| 69215-2 | MR Finger - right W contrast IV |
| 69216-0 | MR Finger - right WO contrast |
| 69217-8 | MR Hip - right Arthrogram WO and W contrast |
| 69218-6 | MR Shoulder - right Arthrogram WO and W contrast |
| 69219-4 | MR Wrist - right and Hand - right |
| 69220-2 | MR Skull base WO and W contrast IV |
| 69221-0 | MR Scrotum and testicle W contrast IV |
| 69222-8 | MR Vena cava |
| 69223-6 | MR Unspecified body region WO contrast |
| 69226-9 | RF Guidance for biopsy of Muscle |
| 69229-3 | SPECT Liver W Tc-99m SC IV |
| 69230-1 | NM Liver Views W Tc-99m SC IV |
| 69233-5 | NM Parotid gland Views W Tc-99m pertechnetate IV |
| 69234-3 | SPECT Spleen W Tc-99m tagged RBC IV |
| 69235-0 | SPECT Scrotum and testicle for blood flow |
| 69236-8 | NM Thyroid gland Views and Views uptake W I-131 PO |
| 69237-6 | SPECT Whole body for tumor |
| 69238-4 | SPECT Urinary bladder and Urethra W contrast intra bladder during voiding |
| 69239-2 | XR Patella Sunrise |
| 69241-8 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Abdomen |
| 69242-6 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Appendix |
| 69243-4 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Lung |
| 69244-2 | RF Guidance for percutaneous drainage of abscess and placement of drainage catheter of Pelvis |
| 69248-3 | RFA Guidance for percutaneous transluminal angioplasty of Renal artery-- W contrast IA |
| 69249-1 | RFA Popliteal artery Views W contrast IA |
| 69250-9 | RFA Portal vein Views W contrast IV |
| 69251-7 | MG Breast Views Post Wire Placement |
| 69252-5 | RFA Guidance for percutaneous transluminal angioplasty of Pulmonary arteries-- W contrast IA |
| 69253-3 | RFA Guidance for atherectomy of Renal vessels-- W contrast |
| 69254-1 | XR Ankle - right 3 Views W standing |
| 69255-8 | XR Knee - right Sunrise and (Tunnel W standing) |
| 69256-6 | XR Knee - right Sunrise |
| 69257-4 | XR Lower extremity - right 2 Views |
| 69258-2 | XR Lower extremity - right AP and Lateral |
| 69259-0 | MG Breast - right Diagnostic for implant |
| 69260-8 | XR Patella - right Single view |
| 69261-6 | XR Patella - right 3 Views |
| 69262-4 | XR Shoulder - right AP and Grashey and Axillary |
| 69263-2 | XR Wrist - right PA W clenched fist |
| 69264-0 | XR Sacrum Views W standing |
| 69265-7 | XR Shoulder 4 Views |
| 69266-5 | XR Shoulder AP and Y |
| 69267-3 | XR Shoulder Grashey and Axillary and Y |
| 69268-1 | MG Breast duct Single view W contrast intra duct |
| 69269-9 | XR Skull AP |
| 69270-7 | XR Skull PA |
| 69271-5 | XR Skull PA and Lateral and Waters and Towne |
| 69272-3 | RF Small bowel Views W contrast via ileostomy |
| 69273-1 | XR Spine thoracolumbar junction 2 Views |
| 69274-9 | XR Thoracic spine 2 Views W standing |
| 69275-6 | XR Thoracic spine Views W standing |
| 69276-4 | US Abdominal Aorta |
| 69277-2 | US Adrenal gland |
| 69278-0 | US Guidance for fluid aspiration of Breast - bilateral |
| 69279-8 | US Guidance for core needle biopsy of Lymph node |
| 69280-6 | US Urinary bladder limited |
| 69281-4 | US Chest limited |
| 69282-2 | US.doppler Unspecified body region limited |
| 69283-0 | US.doppler Extremity veins - bilateral |
| 69284-8 | US.doppler Portal vein and Hepatic vein |
| 69285-5 | US.doppler Umbilical artery Fetal |
| 69286-3 | US Eye limited |
| 69287-1 | US Guidance for fluid aspiration of Lymph node |
| 69292-1 | US Guidance for fluid aspiration of Breast - left |
| 69293-9 | US Extremity artery - left |
| 69294-7 | US Renal artery |
| 69295-4 | US Renal vessels |
| 69296-2 | US Guidance for fluid aspiration of Breast - right |
| 69297-0 | US Extremity artery - right |
| 69298-8 | US Salivary gland |
| 69299-6 | US Scrotum and testicle limited |
| 69300-2 | US for transplanted kidney limited |
| 69301-0 | RFA Guidance for percutaneous transluminal angioplasty of Upper extremity vein-- W contrast IV |
| 69302-8 | XR Wrist Single view W clenched fist |
| 69303-6 | XR Wrist Ulnar deviation and Radial deviation |
| 69304-4 | XR Wrist Ulnar deviation Views |
| 69305-1 | XR Zygomatic arch 2 Views |
| 69306-9 | RF Guidance for aspiration of cyst of Bone |
| 69307-7 | XR Ankle - left Single view |
| 69308-5 | XR Elbow - left Single view |
| 69309-3 | XR Foot - left Single view |
| 69310-1 | XR Hand - left Single view |
| 69311-9 | XR Calcaneus - left Single view |
| 69312-7 | XR Humerus - left Single view |
| 69313-5 | XR Tibia and Fibula - left Single view |
| 69314-3 | XR Ankle - right Single view |
| 69315-0 | XR Elbow - right Single view |
| 69316-8 | XR Foot - right Single view |
| 69317-6 | XR Radius and Ulna - right Single view |
| 69318-4 | XR Hand - right Single view |
| 69319-2 | XR Calcaneus - right Single view |
| 69320-0 | XR Humerus - right Single view |
| 69321-8 | XR Tibia and Fibula - right Single view |
| 69385-3 | US Lower extremity veins - bilateral |
| 69387-9 | US Guidance for biopsy of Epididymis |
| 69388-7 | US Urinary bladder post void |
| 69389-5 | US Femoral artery and Popliteal artery |
| 69390-3 | US Ovary |
| 69391-1 | US Guidance for cordocentesis |
| 69392-9 | US Lower extremity veins - left |
| 69393-7 | US Lumbar spine |
| 69394-5 | US Mesenteric arteries |
| 69395-2 | US Upper extremity veins |
| 69396-0 | US Guidance for biopsy of Spinal cord |
| 69397-8 | US.doppler Breast vessels |
| 69398-6 | US.doppler Extremity vessels - left |
| 69399-4 | US Femoral vein and Popliteal vein |
| 69400-0 | US Guidance for chorionic villus sampling |
| 69402-6 | US Kidney - bilateral and Urinary bladder |
| 69908-2 | CTA Abdominal vessels and Pelvis vessels W contrast IV |
| 70915-4 | US Guidance for aspiration of CSF of Cervical spine |
| 70916-2 | US Guidance for aspiration of CSF of Lumbar spine |
| 70917-0 | US Guidance for aspiration of CSF of Thoracic spine |
| 70918-8 | RF Guidance for injection of Cervical spine |
| 70919-6 | RF Guidance for injection of Lumbar spine |
| 70920-4 | RF Guidance for injection of Thoracic spine |
| 70921-2 | CT Guidance for nerve block of Cervical spine |
| 70922-0 | CT Guidance for nerve block of Thoracic spine |
| 70923-8 | RF Guidance for percutaneous vertebroplasty of Cervical spine |
| 70924-6 | RF Guidance for percutaneous vertebroplasty of Lumbar spine |
| 70925-3 | RF Guidance for percutaneous vertebroplasty of Thoracic spine |
| 70926-1 | US Cervical spine |
| 70927-9 | US Thoracic spine |
| 70931-1 | CT Thoracic spine W contrast intradisc |
| 70932-9 | Portable XR Thoracic spine Single view |
| 70933-7 | RF Thoracic spine Views W contrast intradisc |
| 72137-3 | DBT Breast - right diagnostic |
| 72138-1 | DBT Breast - left diagnostic |
| 72139-9 | DBT Breast - bilateral diagnostic |
| 72140-7 | DBT Breast - right screening |
| 72141-5 | DBT Breast - left screening |
| 72142-3 | DBT Breast - bilateral screening |
| 72238-9 | MR Toes - right WO and W contrast IV |
| 72239-7 | MR Toes - right WO contrast |
| 72240-5 | MR Toes - right W contrast IV |
| 72241-3 | MR Toes - left WO and W contrast IV |
| 72242-1 | MR Toes - left WO contrast |
| 72243-9 | MR Toes - left W contrast IV |
| 72244-7 | MR Pelvis Endorectal WO and W contrast IV |
| 72245-4 | MR Pelvis Defecography W contrast PR |
| 72246-2 | MR Abdomen and Pelvis W contrast PO and WO and W contrast IV |
| 72247-0 | MR Abdomen and Pelvis W contrast PO and WO contrast IV |
| 72248-8 | MRCP Abdomen WO and W contrast IV |
| 72249-6 | CT Facial bones WO contrast |
| 72250-4 | CT Small bowel W contrast PO and W contrast IV |
| 72251-2 | CT Pulmonary arteries for pulmonary embolus |
| 72252-0 | CT Chest and Abdomen and Pelvis WO and W contrast IV |
| 72253-8 | CT Chest and Abdomen and Pelvis WO contrast |
| 72254-6 | CT Chest and Abdomen and Pelvis W contrast IV |
| 72256-1 | XR Abdomen Views for motility W radioopaque markers |
| 72528-3 | US Axilla - right |
| 72529-1 | US Axilla - left |
| 72530-9 | US Guidance for injection of Joint |
| 72531-7 | CT Colon and Rectum W contrast IV and W air contrast PR |
| 72532-5 | US Guidance for ambulatory phlebectomy of Extremity vein - right |
| 72533-3 | US Guidance for ambulatory phlebectomy of Extremity vein - left |
| 72534-1 | US Guidance for laser ablation of Extremity vein - right |
| 72535-8 | US Guidance for laser ablation of Extremity vein - left |
| 72536-6 | US Guidance for vascular sclerotherapy of Extremity veins - bilateral |
| 72537-4 | US Guidance for vascular sclerotherapy of Extremity vein - bilateral |
| 72538-2 | RFA Guidance for removal of peripherally-inserted central venous catheter from Vein |
| 72539-0 | RF Guidance for denervation of Peripheral nerve |
| 72540-8 | RF Guidance for denervation of Spine facet joint |
| 72541-6 | RF Guidance for denervation of Spine Cervical Facet Joint |
| 72542-4 | RF Guidance for denervation of Lumbar Spine Facet Joint |
| 72543-2 | RF Guidance for denervation of Thoracic spine intercostal nerve |
| 72544-0 | RF Guidance for percutaneous device removal of nephrostomy tube of Kidney - bilateral-- W contrast |
| 72545-7 | RF Guidance for percutaneous replacement of drainage catheter of Biliary ducts and Gallbladder |
| 72546-5 | RFA Guidance for removal of CV catheter lumen obstruction of Vein |
| 72547-3 | RFA Guidance for removal of CV catheter pericatheter obstruction of Vein |
| 72548-1 | RFA Guidance for removal of CV catheter from Vein-- W contrast IV |
| 72549-9 | RF Guidance for removal of tunneled CV catheter |
| 72550-7 | RFA Guidance for repair of CV catheter with port or pump of Vein |
| 72551-5 | RFA Guidance for repair of CV catheter without port or pump of Vein |
| 72552-3 | RF Guidance for kyphoplasty of Lumbar spine |
| 72553-1 | RF Guidance for kyphoplasty of Thoracic spine |
| 72554-9 | RF Guidance for trigger point injection of Muscle |
| 72642-2 | US Guidance for vascular sclerotherapy of Extremity veins - right |
| 72643-0 | US Guidance for vascular sclerotherapy of Extremity veins - left |
| 72644-8 | US Guidance for vascular sclerotherapy of Extremity vein - right |
| 72645-5 | US Guidance for vascular sclerotherapy of Extremity vein - left |
| 72830-3 | US.doppler Extremity arteries - bilateral for physiologic artery study |
| 72831-1 | US.doppler Extremity arteries - bilateral for physiologic artery study limited |
| 72832-9 | US.doppler Extremity arteries - bilateral for physiologic artery study at rest and with exercise |
| 72876-6 | XR Surgical specimen Views |
| 75669-2 | RF Guidance for biopsy of Bone marrow |
| 75670-0 | RF Lumbar spine epidural space Views W contrast epidural |
| 75671-8 | CTA Circle of Willis WO and W contrast IV |
| 75672-6 | US Guidance for placement of nephrostomy tube in Kidney |
| 75746-8 | CT Guidance for drainage of abscess and placement of chest tube of Pleural space - bilateral |
| 75747-6 | RF Guidance for drainage of abscess and placement of chest tube of Pleural space - bilateral |
| 75748-4 | CT Guidance for fluid aspiration of Cervical spine Intervertebral disc |
| 75749-2 | RF Guidance for fluid aspiration of Intervertebral disc |
| 75750-0 | RF Guidance for biopsy of Intervertebral disc |
| 75751-8 | RF Guidance for drainage of abscess and placement of chest tube of Pleural space - left |
| 75752-6 | CT Guidance for drainage of abscess and placement of chest tube of Pleural space - left |
| 75816-9 | RF Spine.thoracic epidural space Views W contrast epidural |
| 75817-7 | RF Guidance for drainage of abscess and placement of chest tube of Pleural space - right |
| 75818-5 | CT Guidance for drainage of abscess and placement of chest tube of Pleural space - right |
| 75853-2 | RF Vagina Views W contrast VG |
| 77311-9 | CTA Abdominal aorta and Bilateral vessels for endograft |
| 77448-9 | CT Hindfoot and Midfoot |
| 77451-3 | CTA Thoracic and Abdominal Aorta and Bilateral Vessels for endograft |
| 77456-2 | CT Hindfoot and Midfoot W contrast IV |
| 77457-0 | CT Hindfoot and Midfoot WO and W contrast IV |
| 77458-8 | CT Hindfoot and Midfoot WO contrast |
| 77466-1 | CT Hindfoot - left and Midfoot - left W contrast IV |
| 77467-9 | CT Hindfoot - right and Midfoot - right W contrast IV |
| 77468-7 | CT Hindfoot - left and Midfoot - left WO and W contrast IV |
| 77469-5 | CT Hindfoot - right and Midfoot - right WO and W contrast IV |
| 77470-3 | CT Hindfoot - left and Midfoot - left WO contrast |
| 77471-1 | CT Hindfoot - right and Midfoot - right WO contrast |
| 78031-2 | CTA Abdominal Aorta and Bilateral Runoff Vessels WO and W contrast IV |
| 78032-0 | CTA Thoracic and Abdominal Aorta and Bilateral Runoff Vessels WO and W contrast IV |
| 78037-9 | CTA Abdominal Aorta and Bilateral Runoff Vessels W contrast IV |
| 78038-7 | CTA Thoracic and Abdominal Aorta and Bilateral Runoff Vessels W contrast IV |
| 78973-5 | CT scanogram Lower extremity - bilateral for leg measurement WO contrast |
| 79065-9 | CT Abdomen and Pelvis 3D post processing WO contrast |
| 79066-7 | CT Abdomen 3D post processing WO contrast |
| 79067-5 | CT Airway WO contrast |
| 79068-3 | CT Chest for screening W contrast IV |
| 79069-1 | CT Colon and Rectum for screening WO contrast IV and W air contrast PR |
| 79071-7 | CT Colon and Rectum WO contrast IV and W air contrast PR |
| 79072-5 | CT Guidance for radiation treatment of Unspecified body region |
| 79074-1 | CT Kidney and Ureter and Urinary bladder 3D post processing WO and W contrast IV |
| 79075-8 | CT Pelvis by reconstruction W contrast IV |
| 79076-6 | CT Pelvis by reconstruction WO contrast |
| 79077-4 | CTA Pulmonary arteries for pulmonary embolus W contrast IV |
| 79078-2 | CT Cervical spine by reconstruction W contrast IV |
| 79079-0 | CT Cervical spine by reconstruction WO contrast |
| 79080-8 | CT Lumbar spine by reconstruction W contrast IV |
| 79081-6 | CT Lumbar spine by reconstruction WO contrast |
| 79082-4 | CT Thoracic spine by reconstruction W contrast IV |
| 79083-2 | CT Temporal bone by reconstruction W contrast IV |
| 79084-0 | CT Temporal bone by reconstruction WO contrast |
| 79085-7 | CT Biliary ducts WO and W contrast IV |
| 79086-5 | CT Chest for screening WO contrast |
| 79090-7 | CT densitometry Lumbar spine WO contrast |
| 79091-5 | CT Thoracic spine by reconstruction WO contrast |
| 79092-3 | CT densitometry Thoracic spine WO contrast |
| 79093-1 | CT Unspecified body region 3D post processing |
| 79094-9 | CT Urinary bladder W contrast intra bladder |
| 79095-6 | CT Teeth |
| 79096-4 | CT Chest 3D post processing WO contrast |
| 79097-2 | CT Chest and Abdomen 3D post processing WO contrast |
| 79098-0 | CT Chest and Abdomen and Pelvis 3D post processing WO contrast |
| 79099-8 | CT Pelvis 3D post processing WO contrast |
| 79101-2 | CT Colon and Rectum for screening W air contrast PR |
| 79103-8 | CT Abdomen W contrast IV |
| 79349-7 | XR Spine Lumbar and Sacrum GE 6 Views |
| 79350-5 | XR Abdomen GE 3 Views |
| 79351-3 | XR Cervical spine GE 2 Views |
| 79352-1 | XR Cervical spine GE 6 Views |
| 79353-9 | XR Elbow GE 3 Views |
| 79354-7 | XR Finger GE 2 Views |
| 79355-4 | XR Foot 3 Views W standing |
| 79356-2 | XR Hand 1 or 2 Views |
| 79357-0 | XR Hand GE 3 Views |
| 79358-8 | XR Hip - bilateral GE 4 Views |
| 79359-6 | XR Hip - left GE 2 Views |
| 79360-4 | XR Hip - right GE 2 Views |
| 79361-2 | XR Hip GE 2 Views |
| 79362-0 | XR Humerus GE 2 Views |
| 79363-8 | XR Knee - bilateral AP and Lateral and Merchants and (Views W standing) |
| 79364-6 | XR Knee GE 4 Views |
| 79365-3 | XR Ribs - bilateral GE 3 Views |
| 79366-1 | XR Ribs - unilateral and Chest 2 Views |
| 79367-9 | XR Sacrum and Coccyx GE 2 Views |
| 79368-7 | XR Shoulder - left GE 2 Views |
| 79369-5 | XR Shoulder - right GE 2 Views |
| 79370-3 | XR Shoulder GE 2 Views |
| 79371-1 | XR Spine Lumbar and Sacrum GE 2 Views |
| 79372-9 | XR Spine Lumbar and Sacrum GE 4 Views |
| 79373-7 | XR Toe GE 2 Views |
| 79374-5 | US Abdominal Aorta for screening |
| 80495-5 | MR Mediastinum WO contrast |
| 80496-3 | MR Unspecified body region 3D post processing |
| 80497-1 | MR Guidance for needle localization of Breast - right |
| 80498-9 | MR Guidance for needle localization of Breast - left |
| 80499-7 | MR Whole body WO and W contrast IV |
| 80501-0 | MR Small bowel W contrast PO and WO contrast IV |
| 80502-8 | MRA Abdominal Aorta and Bilateral Runoff Vessels WO and W contrast IV |
| 80503-6 | MR Small bowel W contrast PO and WO and W contrast IV |
| 80504-4 | MR Guidance for biopsy of Unspecified body region |
| 80505-1 | MR Brain for new diagnosis tumor WO and W contrast IV |
| 80506-9 | MR Brain for low grade tumor WO and W contrast IV |
| 80507-7 | MR Brain for high grade tumor WO and W contrast IV |
| 80508-5 | MR Upper extremity.joint Arthrogram |
| 80509-3 | MR Guidance for placement of clip in Unspecified body region |
| 80510-1 | MR Brain for metastasis WO and W contrast IV |
| 80511-9 | MR Brain for postoperative |
| 80512-7 | MR Bone marrow WO contrast |
| 80513-5 | MR Bone marrow W contrast IV |
| 80514-3 | MR Bone marrow WO and W contrast IV |
| 80583-8 | Functional MR Brain for motor function |
| 80584-6 | MR Urethra Endovaginal WO contrast |
| 80585-3 | MR Pelvis Endorectal W contrast IV |
| 80833-7 | US for multiple gestation pregnancy limited |
| 80834-5 | US for multiple gestation pregnancy in first trimester |
| 80835-2 | US transabdominal and transvaginal for multiple gestation pregnancy in first trimester |
| 80836-0 | US for multiple gestation pregnancy in second or third trimester |
| 80837-8 | US for multiple gestation pregnancy with fetal abnormality |
| 80838-6 | US Liver limited |
| 80839-4 | US Pancreas limited |
| 80840-2 | US Spleen limited |
| 80841-0 | US Guidance for placement of needle in Breast |
| 80842-8 | US Guidance for additional aspiration of cyst of Breast - left |
| 80843-6 | US Guidance for vacuum biopsy of Breast - left |
| 80844-4 | US Guidance for fine needle biopsy of Breast - left |
| 80846-9 | US Guidance for additional aspiration of cyst of Breast - right |
| 80847-7 | US Guidance for vacuum biopsy of Breast - right |
| 80848-5 | US Guidance for fine needle biopsy of Breast - right |
| 80850-1 | US.doppler Carotid arteries limited |
| 80851-9 | US.doppler Cerebral artery middle Fetal for pregnancy |
| 80852-7 | US Axilla |
| 80853-5 | US Guidance for injection of Elbow |
| 80854-3 | US Extremity musculoskeletal tissue limited |
| 80855-0 | US Extremity musculoskeletal tissue |
| 80856-8 | US.doppler Head limited |
| 80857-6 | US.doppler Head |
| 80858-4 | US Head and neck soft tissue |
| 80859-2 | US.doppler Heart |
| 80860-0 | US Lower extremity veins - unilateral limited |
| 80861-8 | US Lower extremity soft tissue |
| 80862-6 | US Pelvis for in vitro fertilization |
| 80863-4 | US.doppler for transplanted kidney |
| 80864-2 | US.doppler for pregnancy |
| 80865-9 | US transvaginal for pregnancy |
| 80866-7 | US for pregnancy in second or third trimester |
| 80867-5 | US transabdominal and transvaginal for pregnancy in first trimester |
| 80868-3 | US for pregnancy with fetal abnormality |
| 80869-1 | US for pregnancy in first trimester |
| 80870-9 | US for pregnancy limited |
| 80871-7 | US Ovary for torsion |
| 80872-5 | US.doppler Uterus and Fallopian tubes W saline IU |
| 80873-3 | US.doppler Penis limited |
| 80874-1 | US.doppler Penis vessels |
| 80875-8 | US Penis soft tissue |
| 80876-6 | US Prostate transrectal for volume measurement |
| 80877-4 | US Scrotum and testicle for torsion |
| 80878-2 | US.doppler Umbilical artery Fetal for pregnancy |
| 80879-0 | US Upper extremity veins - unilateral limited |
| 80880-8 | US Guidance for injection of Carpal tunnel |
| 80881-6 | US Upper extremity soft tissue |
| 80882-4 | US Guidance of Unspecified body region-- during surgery |
| 80895-6 | US Upper extremity veins - bilateral |
| 80896-4 | US.doppler Aorta and Iliac artery - bilateral |
| 80897-2 | US.doppler Aorta and Iliac artery - bilateral limited |
| 80898-0 | US Groin and Pseudoaneurysm |
| 81158-8 | US Pediatric Head |
| 81159-6 | US Pediatric Cervical and thoracic and lumbar spine |
| 81160-4 | US.doppler Pediatric limited Head |
| 81161-2 | US.doppler Heart for blood flow |
| 81162-0 | US Guidance for needle localization Breast - left and MG Views Breast specimen |
| 81163-8 | US Guidance for needle localization Breast - right and MG Views Breast specimen |
| 81164-6 | US Pediatric limited Hip - bilateral |
| 81165-3 | US Guidance for peripheral venous access of Vein |
| 81206-5 | NM Liver and Spleen Views W Tc-99m SC IV |
| 81542-3 | NM Lumbar spine Views for CSF leak post lumbar puncture W radionuclide IT |
| 81543-1 | NM Head Views for CSF leak with rhinorrhea or otorrhea W radionuclide IT |
| 81544-9 | NM Gastrointestinal tract Views for gastrointestinal bleeding |
| 81545-6 | NM Abdomen and Pelvis Views for shunt patency |
| 81546-4 | NM Views for blood flow and kidney function |
| 81547-2 | SPECT Whole body W In-111 pentetreotide IV |
| 81548-0 | SPECT Unspecified body region W tagged WBC IV |
| 81549-8 | SPECT+CT Lymph node |
| 81550-6 | SPECT+CT Parathyroid gland |
| 81551-4 | PET+CT Bone from skull base to mid-thigh W 18F-NaF IV |
| 81552-2 | PET+CT Whole body Bone W 18F-NaF IV |
| 81553-0 | PET+CT Guidance limited for localization of tumor of Unspecified body region-- W 18F-FDG IV |
| 81554-8 | PET+CT Guidance for localization of tumor of Skull base to mid-thigh-- W 18F-FDG IV |
| 81555-5 | PET+CT Guidance for localization of tumor of Whole body-- W 18F-FDG IV |
| 81556-3 | SPECT Unspecified body region for infection or inflammation |
| 81557-1 | SPECT Brain W florbetapir IV |
| 81558-9 | SPECT Brain W Tc-99m IV |
| 81559-7 | PET+CT Unspecified body region for simulation limited |
| 81560-5 | SPECT Whole body W In-111 capromab pendetide IV |
| 81561-3 | SPECT Heart W multiple states of exercise |
| 81562-1 | SPECT Heart W single state of exercise |
| 81572-0 | NM Salivary gland Views for function |
| 81573-8 | NM Brain Brain death protocol Views |
| 81574-6 | NM Brain GE 4 Views |
| 81575-3 | NM Brain GE 4 Views for blood flow |
| 81576-1 | NM Brain LT 4 Views for blood flow |
| 81577-9 | PT Brain for amyloidosis |
| 81578-7 | PT Brain metabolic |
| 81579-5 | PT perfusion Brain |
| 81580-3 | NM Thyroid gland Views for therapy W I-131 PO |
| 81581-1 | NM Thyroid gland Views for dosimetry W radionuclide PO |
| 81582-9 | NM Thyroid gland Uptake |
| 81583-7 | NM Whole body Views W Sm-153 IV |
| 81584-5 | NM Whole body Views W tagged WBC IV |
| 81585-2 | NM Unspecified body region Views W tagged WBC IV |
| 81586-0 | NM Whole body Views W Y-90 ibritumomab tiuxetan IV |
| 81587-8 | NM Unspecified body region Limited Views for infection or inflammation |
| 81588-6 | NM Whole body Views for thyroid tumor |
| 81589-4 | NM Whole body Views for infection or inflammation |
| 81590-2 | NM Extremity veins - bilateral Views for thrombosis |
| 81591-0 | NM Extremity veins - unilateral Views for thrombosis |
| 81592-8 | NM Views for transplanted kidney |
| 81593-6 | NM Lymph node Views |
| 81594-4 | NM Lymph node - bilateral Views |
| 81595-1 | NM Lymph node Views for lymphedema |
| 81596-9 | NM Lung Quantitative Views Ventilation and Perfusion |
| 81597-7 | NM Bones Views for metastasis W Ra-223 IV |
| 81598-5 | NM Whole body Views for thyroid tumor metastasis post therapy |
| 81599-3 | NM Guidance for multiple days for localization of tumor of Whole body |
| 81600-9 | NM Unspecified body region Limited Views for infection or inflammation W Tc-99m tagged WBC IV |
| 81601-7 | NM Unspecified body region Limited Views for thyroid tumor metastasis |
| 81602-5 | NM Stomach Views for gastric emptying solid phase W radionuclide PO |
| 81603-3 | NM Views for blood flow and kidney function W diuretic IV |
| 81604-1 | NM Kidney Views for glomerular filtration rate |
| 81605-8 | NM Ureter and Urinary bladder Views |
| 81606-6 | NM Liver and Biliary ducts and Gallbladder Views W cholecystokinetic IV |
| 81607-4 | NM Kidney cortex Views |
| 81608-2 | NM Views for blood flow and kidney function W ACE inhibitor PO |
| 81609-0 | NM Liver Views W SIR-spheres intraarterial hepatic injection |
| 81610-8 | NM Liver Views W Theraspheres intraarterial hepatic injection |
| 81611-6 | NM Head to Pelvis Views for shunt patency |
| 81613-2 | SPECT Liver for hemangioma |
| 82123-1 | MR Guidance for radiation treatment of Unspecified body region |
| 82124-9 | US Guidance for radiation treatment of Unspecified body region |
| 82126-4 | PT Guidance for radiation treatment of Unspecified body region |
| 82128-0 | MR Brain and Face WO contrast |
| 82129-8 | MR Brain and Face WO and W contrast IV |
| 82130-6 | MR Face and Neck WO contrast |
| 82131-4 | MR Face and Neck WO and W contrast IV |
| 82132-2 | CT Face and Neck WO and W contrast IV |
| 82133-0 | CT Face and Neck WO contrast |
| 82136-3 | NM Whole body Views for tumor W I-123 MIBG IV |
| 82676-8 | CT Guidance for arthrocentesis of Knee - left |
| 82677-6 | CTA Abdominal Aorta W contrast IV |
| 82678-4 | CTA Abdominal Aorta WO and W contrast IV |
| 82679-2 | CTA Abdominal vessels and Pelvis vessels WO and W contrast IV |
| 82680-0 | CTA Head vessels and Neck vessels WO and W contrast IV |
| 82681-8 | CT Guidance for biopsy of Oral tissue |
| 82682-6 | CT Clavicle - left WO contrast |
| 82683-4 | CT Clavicle - right WO contrast |
| 82684-2 | CT Clavicle WO and W contrast IV |
| 82685-9 | CT Clavicle W contrast IV |
| 82686-7 | CT Clavicle - right W contrast IV |
| 82687-5 | CT Clavicle WO contrast |
| 82688-3 | CT Colon and Rectum WO and W contrast IV and W air contrast PR |
| 82689-1 | CT Small bowel W contrast PO and WO and W contrast IV |
| 82690-9 | CT Head and Cervical spine WO contrast |
| 82691-7 | CT Head and Neck W contrast IV |
| 82692-5 | CT Head and Neck WO contrast |
| 82693-3 | CT Pelvis and Lower extremity W contrast IV |
| 82694-1 | CT Lower extremity - bilateral WO and W contrast IV |
| 82695-8 | CT Pelvis and Lower extremity - bilateral W contrast IV |
| 82696-6 | CT Spine Lumbar and Sacrum W contrast IV |
| 82697-4 | CT Spine Lumbar and Sacrum WO contrast |
| 82698-2 | CT Ribs - left W contrast IV |
| 82699-0 | CT Ribs - left WO contrast |
| 82700-6 | CT Ribs - right W contrast IV |
| 82701-4 | CT Ribs - right WO contrast |
| 82702-2 | CT Ribs - right WO and W contrast IV |
| 82703-0 | CT Sacrum and Coccyx WO and W contrast IV |
| 82704-8 | CT Sacrum and Coccyx W contrast IV |
| 82705-5 | CT Scapula - left WO contrast |
| 82706-3 | CT Scapula - right WO contrast |
| 82707-1 | CT Scapula - left WO and W contrast IV |
| 82708-9 | CTA Lower extremity vessels - bilateral WO and W contrast IV |
| 82709-7 | CTA Thoracic Aorta |
| 82710-5 | CTA Lower extremity vessels - right |
| 82711-3 | CTA Lower extremity vessels - bilateral |
| 82712-1 | CTA Lower extremity vessels - left |
| 82713-9 | CTA Upper extremity vessels - left |
| 82714-7 | CTA Upper extremity vessels - right |
| 82715-4 | CT Guidance for arthrocentesis of Knee - right |
| 82716-2 | CT Clavicle - left W contrast IV |
| 82717-0 | CT Ribs - left WO and W contrast IV |
| 82718-8 | CT Scapula - right WO and W contrast IV |
| 82742-8 | CT Head WO and W contrast IV and CT Orbit - bilateral W contrast IV |
| 82802-0 | CT Head WO and W contrast IV and CT Sinuses W contrast IV |
| 82803-8 | CT Head WO and W contrast IV and CT Temporal bone W contrast IV |
| 82804-6 | CT Head WO and W contrast IV and CT Neck W contrast IV |
| 82805-3 | PET+CT Guidance for localization of tumor of Whole body-- W 18F-FDG IV and WO contrast |
| 82806-1 | PET+CT Guidance for localization of tumor of Whole body-- W 18F-FDG IV and W contrast IV |
| 82807-9 | PET+CT Guidance for localization of tumor of Skull vertex to mid-thigh-- W 18F-FDG IV and WO contrast |
| 82808-7 | PET+CT Guidance for localization of tumor of Skull base to mid-thigh-- W 18F-FDG IV and WO contrast |
| 82809-5 | PET+CT Guidance for localization of tumor of Skull base to mid-thigh-- W 18F-FDG IV and W contrast IV |
| 83012-5 | DXA Skeletal system.axial Views for bone density |
| 83013-3 | DXA Skeletal system.peripheral Views for bone density |
| 83014-1 | DXA Skeletal system.axial Views for bone density and vertebral fracture |
| 83015-8 | XR Abdomen 2 Views for renal calculus |
| 83016-6 | XR Abdomen GE 3 Views AP and Oblique and Cone |
| 83017-4 | XR Chest View and Abdomen Supine and Upright |
| 83018-2 | XR Ankle 1 or 2 Views |
| 83019-0 | XR Chest and Abdomen and Pelvis View babygram |
| 83020-8 | XR Bones Complete Survey Views |
| 83021-6 | XR Cervical spine 2 or 3 views and (Views W flexion and W extension) |
| 83022-4 | XR Cervical spine 2 or 3 views and (Views W flexion and W extension) and Views oblique |
| 83023-2 | XR Cervical spine 4 or 5 Views |
| 83024-0 | XR Chest 2 Views and Views Lateral-decubitus |
| 83025-7 | XR Coccyx GE 2 Views |
| 83026-5 | XR Elbow 1 or 2 Views |
| 83027-3 | XR Elbow GE 4 Views |
| 83028-1 | XR Cervical and thoracic and lumbar spine GE 2 Views |
| 83029-9 | XR Facial bones and Zygomatic arch 1 or 2 Views |
| 83030-7 | XR Foot 1 or 2 Views |
| 83031-5 | XR Pelvis AP and Hip - bilateral GE 2 Views |
| 83032-3 | XR Hip GE 2 Views preoperative |
| 83033-1 | XR Hip single view during surgery |
| 83034-9 | XR Pelvis and Hip - bilateral GE 2 views for pediatrics |
| 83035-6 | XR Knee 1 or 2 Views during surgery |
| 83036-4 | XR Lower extremity GE 2 Views |
| 83037-2 | XR Lumbar spine Single view during surgery |
| 83038-0 | XR Lumbar spine Greater than 4 views and (Greater than 1 view W R-bending and W L-bending) |
| 83039-8 | XR Mastoid - bilateral GE 3 Views |
| 83040-6 | XR Ribs - unilateral 2 Views |
| 83041-4 | XR Ribs - unilateral 2 Views and Chest Single view |
| 83042-2 | XR Ribs - unilateral 2 Views and Chest AP |
| 83043-0 | XR Sacroiliac joint - bilateral 1 or 2 Views |
| 83044-8 | XR Sacrum GE 2 Views |
| 83045-5 | XR Scapula AP and Lateral |
| 83046-3 | XR Skull LE 3 AP and Lateral Views |
| 83047-1 | XR Sternum GE 2 Views |
| 83048-9 | XR Tibia and Fibula GE 3 Views |
| 83049-7 | XR Upper extremity GE 2 Views |
| 83050-5 | XR Wrist 1 or 2 Views |
| 83051-3 | DXA Cervical and thoracic and lumbar spine Views for vertebral fracture |
| 83290-7 | CTA Pulmonary arteries - bilateral and Pelvis veins and Lower extremity veins - bilateral for pulmonary embolus and deep vein thrombosis W contrast IV |
| 83291-5 | CT Thumb WO contrast |
| 83292-3 | CT Scapula W contrast |
| 83293-1 | CT Spine Cervical and Spine Lumbar W contrast IV |
| 83294-9 | CT Thoracic and lumbar spine W contrast IV |
| 83295-6 | CT Neck and Superior mediastinum W contrast IV |
| 83296-4 | CT Head W contrast IV and CT Orbit - bilateral WO and W contrast IV |
| 83297-2 | CT Spine Cervical and Spine Lumbar WO and W contrast IV |
| 83298-0 | CTA Chest vessels and Abdominal vessels and Pelvis vessels WO and W contrast IV |
| 83299-8 | CT Chest and Abdomen and Pelvis WO and W contrast IV and CTA Thoracic and abdominal aorta WO and W contrast IV |
| 83300-4 | CT Scapula - bilateral WO and W contrast IV |
| 83301-2 | CT Neck and Superior mediastinum WO and W contrast IV |
| 83302-0 | CT Head and Temporal bone WO contrast |
| 83303-8 | CT Toe WO contrast |
| 83304-6 | CT Cervical and thoracic spine WO contrast |
| 83305-3 | CT Spine Cervical and Spine Lumbar WO contrast |
| 83306-1 | CT Head and Maxillofacial region WO contrast |
| 83307-9 | CT Head and Mandible WO contrast |
| 83308-7 | CT Neck and Superior mediastinum WO contrast |
| 83309-5 | CT Sinuses and Mandible WO contrast |
| 83310-3 | CT Thoracic and lumbar spine WO contrast |
| 85040-4 | CT Unspecified body region 3D printed model |
| 85041-2 | MR Unspecified body region 3D printed model |
| 86348-0 | MG Breast - left Guidance for needle localization and Breast specimen Views |
| 86350-6 | MG Breast - unilateral Single view for clip placement |
| 86351-4 | MG Guidance for additional aspiration of cyst of Breast - left |
| 86352-2 | MG Guidance for additional aspiration of cyst of Breast - right |
| 86353-0 | MG Guidance for placement of clip in Breast - left |
| 86354-8 | MG Guidance for placement of clip in Breast - right |
| 86355-5 | MG Guidance for additional needle localization of Breast - left |
| 86356-3 | MG Guidance for additional needle localization of Breast - right |
| 86357-1 | MG Guidance for needle localization of Breast - left |
| 86358-9 | MG Guidance for needle localization of Breast - right |
| 86360-5 | MG Breast - right Guidance for needle localization and Breast specimen Views |
| 86361-3 | MG stereo Guidance for additional biopsy of Breast - left |
| 86362-1 | MG stereo Guidance for additional biopsy of Breast - right |
| 86363-9 | MG Guidance for additional vacuum biopsy of Breast - left |
| 86364-7 | MG Guidance for additional vacuum biopsy of Breast - right |
| 86365-4 | MG Guidance for vacuum biopsy of Breast - left |
| 86366-2 | MG Guidance for vacuum biopsy of Breast - right |
| 86367-0 | MG Breast Diagnostic for clinical call back |
| 86368-8 | MG Breast - left Diagnostic for clinical call back |
| 86369-6 | MG Breast - right Diagnostic for clinical call back |
| 86370-4 | MG Breast Diagnostic for technical call back |
| 86372-0 | RF Kidney and Ureter and Urinary bladder Views W contrast IV |
| 86373-8 | RF AV fistula Views W contrast via additional puncture |
| 86374-6 | RFA Pedal lymphatic vessels - bilateral Views W contrast intra lymphatic |
| 86375-3 | RFA Pedal lymphatic vessels - unilateral Views W contrast intra lymphatic |
| 86376-1 | RF Biliary ducts Views W contrast via existing catheter |
| 86377-9 | RF Guidance for advancement of feeding tube of Gastrointestinal tract |
| 86378-7 | RF Gastrointestinal tract Views for fistula |
| 86379-5 | RF Small bowel Views for loop diversion |
| 86380-3 | RF Kidney and Ureter and Urinary bladder Views for fistula |
| 86381-1 | RF Colon Screening W air and barium contrast PR |
| 86382-9 | RF Biliary ducts Limited Views during surgery |
| 86383-7 | RF Biliary ducts Views W contrast IV |
| 86384-5 | RF Gallbladder Views W contrast and fatty meal PO |
| 86385-2 | RF Gallbladder Views W contrast PO |
| 86386-0 | RF Gastrointestinal tract upper Views W barium contrast PO |
| 86387-8 | RF Kidney and Ureter and Urinary bladder Views W contrast antegrade |
| 86388-6 | RF Kidney and Ureter and Urinary bladder Views W contrast retrograde |
| 86389-4 | RF Kidney and Ureter and Urinary bladder Views during surgery W contrast retrograde |
| 86390-2 | RF Kidney and Ureter and Urinary bladder Views W contrast via nephrostomy tube |
| 86391-0 | RF AV fistula Views W contrast via existing catheter |
| 86392-8 | RF Kidney and Ureter and Urinary bladder Limited Views W contrast IV |
| 86393-6 | RF Kidney - bilateral and Ureter - bilateral and Urinary bladder Views W contrast retrograde |
| 86394-4 | RFA Thoracic Aorta Views W contrast IA |
| 86395-1 | RF videography Hypopharynx and Esophagus Views for swallowing function W speech and W barium contrast PO |
| 86396-9 | RFA Extremity veins - unilateral Views W contrast IV |
| 86397-7 | RF Guidance for drainage and placement of suprapubic catheter of Urinary bladder |
| 86398-5 | RF Cerebral cisterns Views W contrast IT |
| 86399-3 | RF Guidance for Views and Guidance for injection of non-vascular shunt of Unspecified body region |
| 86400-9 | RF Guidance for placement of needle in Unspecified body region |
| 86401-7 | RF Urinary bladder Views W contrast intra bladder |
| 86402-5 | RF Shoulder Arthrogram limited |
| 86403-3 | RF Guidance for placement of catheter in Fallopian tube |
| 86404-1 | RF Guidance for fluid aspiration of Urinary bladder |
| 86405-8 | RF Guidance for exchange of tube of Unspecified body region |
| 86406-6 | RF Unspecified body region Less than 1 hour Views during surgery |
| 86407-4 | RF Guidance of Unspecified body region |
| 86408-2 | RF Pelvis Views for urinary pouch |
| 86409-0 | RF Rectum Views for rectal dysfunction W barium contrast PR |
| 86410-8 | RF Pharynx and Cervical esophagus Views W barium contrast PO |
| 86411-6 | RF Posterior fossa - bilateral Views W contrast IT |
| 86412-4 | RFA Pedal lymphatic vessels Views W contrast intra lymphatic |
| 86413-2 | RF Guidance for placement of long feeding tube in Gastrointestinal tract |
| 86414-0 | RFA Renal arteries - unilateral Views W contrast IA |
| 86415-7 | RFA Renal vein - unilateral Views W contrast IV |
| 86416-5 | MG Breast - bilateral Guidance for needle localization and Breast specimen Views |
| 86417-3 | RFA Cerebral arteries Bilateral Views W contrast IA |
| 86418-1 | RFA Pulmonary arteries - unilateral Views W contrast IA |
| 86419-9 | RFA Visceral arteries Views W contrast IA |
| 86420-7 | RF Gastrointestinal tract upper Views W air contrast PO and W barium contrast PO |
| 86421-5 | XR Abdomen and RF Gastrointestinal tract upper W air contrast PO and W barium contrast PO |
| 86422-3 | XR Abdomen and RF Gastrointestinal tract upper W water soluble contrast PO |
| 86423-1 | XR Abdomen and RF Gastrointestinal tract upper W contrast PO |
| 86424-9 | XR Abdomen and RF Gastrointestinal tract upper W barium contrast PO |
| 86425-6 | RF Guidance for manometry of Kidney |
| 86426-4 | RFA Jugular vein - unilateral Views W contrast IV |
| 86427-2 | RF Upper gastrointestinal tract and Small bowel Views W air contrast PO and W barium contrast PO |
| 86428-0 | RFA Extremity arteries - unilateral Views W contrast IA |
| 86429-8 | RFA Cerebral arteries - unilateral Views W contrast IA |
| 86430-6 | RF Posterior fossa - unilateral Views W contrast IT |
| 86431-4 | RFA Cerebral arteries - bilateral and Cervical arteries - bilateral Views W contrast IA |
| 86432-2 | RFA Cerebral arteries - unilateral and Cervical arteries - unilateral Views W contrast IA |
| 86433-0 | RFA Lumbar spine intercostal arteries Views W contrast IA |
| 86434-8 | RFA Carotid arteries - unilateral Views W contrast IA |
| 86435-5 | RFA Jugular vein - bilateral Views W contrast IV |
| 86436-3 | RF Guidance for treatment of Fistula-- W contrast intra fistula |
| 86437-1 | RF Fistula Diagnostic W contrast intra fistula |
| 86438-9 | RF Guidance for check of feeding tube of Gastrointestinal tract upper |
| 86439-7 | RF Cerebral sinuses Views W contrast IV |
| 86440-5 | RF Seminal vesicle Views W contrast intra seminal vesicle |
| 86441-3 | RF Guidance for manometry of Kidney and Ureter and Urinary bladder |
| 86442-1 | RFA Vertebral artery - unilateral Views W contrast IA |
| 86443-9 | RF Ureter Views W contrast intra ureter |
| 86460-3 | RFA Spine vessel Views |
| 86461-1 | RFA Adrenal vessel Views |
| 86462-9 | DBT Breast - unilateral |
| 86463-7 | DBT Breast - bilateral |
| 86464-5 | RFA Guidance for repair of aneurysm or dissection of Infrarenal aorta |
| 86957-8 | CT Salivary gland WO and W contrast IV |
| 86958-6 | CT Neck and Chest WO and W contrast IV |
| 86959-4 | CT Cervical and thoracic spine WO and W contrast IV |
| 86960-2 | CTA Upper extremity vessels - right W contrast IV |
| 86961-0 | CTA Upper extremity vessels - left W contrast IV |
| 86962-8 | CTA Upper extremity vessels - bilateral W contrast IV |
| 86963-6 | CTA Lower extremity vessels - right W contrast IV |
| 86964-4 | CTA Lower extremity vessels - left W contrast IV |
| 86965-1 | CTA Lower extremity vessels - bilateral W contrast IV |
| 86966-9 | CT Salivary gland WO contrast |
| 86967-7 | CT Foot - bilateral WO contrast |
| 86968-5 | CT Hand - bilateral W contrast IV |
| 86969-3 | CT Shoulder - bilateral W contrast IV |
| 86970-1 | CT Sacrum and Coccyx WO contrast |
| 86971-9 | CTA Chest and abdominal vessels WO and W contrast IV |
| 86972-7 | CT Head and Neck WO and W contrast IV |
| 86973-5 | CT Foot - bilateral W contrast IV |
| 86974-3 | CT Thoracic and lumbar spine WO and W contrast IV |
| 86976-8 | PET+CT Brain metabolic |
| 86977-6 | CT Head and Temporal bone W contrast IV |
| 86978-4 | CT Head and Sinuses W contrast IV |
| 86979-2 | CT Pelvis and Hip - bilateral WO contrast |
| 86981-8 | CTA Chest vessels |
| 86982-6 | CTA Chest and abdominal vessels W contrast IV |
| 86983-4 | CTA Chest vessels and Abdominal vessels and Pelvis vessels W contrast IV |
| 86984-2 | CT Cervical and thoracic and lumbar spine W contrast IV |
| 86985-9 | CT Cervical and thoracic spine W contrast IV |
| 86986-7 | CT Neck and Chest W contrast IV |
| 86987-5 | CT Cervical and thoracic and lumbar spine WO contrast |
| 86988-3 | CT Orbit and Face WO contrast |
| 86989-1 | CT Head and Orbit - bilateral W contrast IV |
| 86990-9 | CT Head and Orbit - bilateral WO contrast |
| 86991-7 | CT Head and Maxillofacial region and Cervical spine WO contrast |
| 86992-5 | CT Head and Sinuses WO contrast |
| 86993-3 | Guidance for 1 level kyphoplasty of Spine vertebra |
| 86994-1 | Guidance for 1 or 2 injections of trigger point of Muscle |
| 86995-8 | Guidance for abscess |
| 86996-6 | Guidance for additional augmentation of Spine vertebra |
| 86997-4 | Guidance for additional day infusion of thrombolytic of Vessel-- W thrombolytic via catheter |
| 86998-2 | Guidance for additional percutaneous mechanical thrombectomy of Vein |
| 86999-0 | Guidance for additional percutaneous mechanical thrombectomy of Artery |
| 87000-6 | Guidance for additional placement of endovascular device of Vein |
| 87001-4 | Guidance for additional placement of stent of Artery |
| 87002-2 | Guidance for additional placement of wire |
| 87003-0 | Guidance for additional vertebroplasty of Spine vertebra |
| 87004-8 | Guidance for arthrocentesis of Intermediate joint |
| 87005-5 | Guidance for arthrocentesis of Major joint |
| 87006-3 | Guidance for arthrocentesis of Small joint |
| 87007-1 | Guidance for arthrocentesis of Joint |
| 87008-9 | Guidance for fluid aspiration of Bone marrow |
| 87009-7 | Guidance for aspiration of cyst |
| 87010-5 | Guidance for aspiration of cyst of Bone |
| 87011-3 | Guidance for aspiration of ganglion cyst |
| 87012-1 | Guidance for fluid aspiration of Lymph node |
| 87013-9 | Guidance for percutaneous biopsy of Bone |
| 87014-7 | Guidance for biopsy of Bone marrow |
| 87015-4 | Guidance for biopsy of Lymph node |
| 87016-2 | Guidance for biopsy of Soft tissue |
| 87017-0 | Guidance for check of drainage catheter for abscess |
| 87018-8 | Guidance for deep biopsy of Bone |
| 87019-6 | Guidance for drainage and placement of drainage catheter |
| 87020-4 | Guidance for embolization of Artery |
| 87021-2 | Guidance for embolization of Vein |
| 87022-0 | Guidance for embolization of Vessels |
| 87023-8 | Guidance for exchange of drainage catheter for abscess |
| 87024-6 | Guidance for additional day infusion of thrombolytic of Chest-- W thrombolytic via chest tube |
| 87025-3 | Guidance for additional level kyphoplasty of Thoracic spine |
| 87026-1 | Guidance for additional vertebroplasty of Thoracic spine |
| 87027-9 | Guidance for biopsy of Chest Pleura |
| 87028-7 | Guidance for biopsy of Lung |
| 87029-5 | Guidance for biopsy of Mediastinum |
| 87030-3 | Guidance for biopsy of Neck or Chest Soft tissue |
| 87031-1 | Guidance for check of peritoneovenous shunt of Chest and Abdomen |
| 87032-9 | Guidance for cryoablation of Lung |
| 87033-7 | Guidance for drainage and placement of chest tube of Pleural space |
| 87034-5 | Guidance for exchange of catheter portion only of CV catheter with port of Chest |
| 87035-2 | Guidance for exchange of CV catheter with port of Chest |
| 87036-0 | Guidance for additional level kyphoplasty of Lumbar spine |
| 87037-8 | Guidance for additional placement of stent of Iliac artery |
| 87038-6 | Guidance for additional transluminal angioplasty of Iliac artery |
| 87039-4 | Guidance for additional vertebroplasty of Lumbar spine |
| 87040-2 | Guidance for aspiration of cyst of Kidney |
| 87041-0 | Guidance for percutaneous biopsy of Kidney |
| 87042-8 | Guidance for percutaneous biopsy of Liver |
| 87043-6 | Guidance for biopsy of Ureter |
| 87044-4 | Guidance for check of tube of Biliary ducts |
| 87045-1 | Guidance for cholangioscopy and removal of calculus of Gallbladder |
| 87046-9 | Guidance for cholangioscopy of Gallbladder |
| 87047-7 | Guidance for cholecystostomy of Gallbladder |
| 87048-5 | Guidance for conversion of G-tube to GJ-tube of Gastrointestinal tract upper |
| 87049-3 | Guidance for cryoablation of Kidney |
| 87050-1 | Guidance for cryoablation of Liver |
| 87051-9 | Guidance for dilation of stricture of Biliary ducts |
| 87052-7 | Guidance for exchange of G-tube of Stomach |
| 87053-5 | Guidance for exchange of J-tube of Gastrointestinal tract upper |
| 87054-3 | Guidance for exchange of nephrostomy tube of Kidney |
| 87055-0 | Guidance for biopsy of Pancreas |
| 87056-8 | Guidance for biopsy of Abdomen |
| 87057-6 | Guidance for placement of fiducial marker in Abdomen |
| 87058-4 | Guidance for radiofrequency ablation of Kidney |
| 87059-2 | Guidance for biopsy of Biliary ducts |
| 87060-0 | Guidance for removal of calculus from Biliary ducts |
| 87061-8 | Guidance for injection of contrast of Biliary ducts |
| 87062-6 | Guidance for nerve block of Celiac plexus |
| 87063-4 | Guidance for removal of GJ-tube from Gastrointestinal tract upper |
| 87064-2 | Guidance for placement of GJ-tube in Gastrointestinal tract upper |
| 87065-9 | Guidance for placement of G-tube in Gastrointestinal tract upper |
| 87066-7 | Guidance for percutaneous placement of nephrostomy tube of Kidney |
| 87067-5 | Guidance for transjugular biopsy of Kidney |
| 87068-3 | Guidance for transjugular biopsy and venography of Kidney |
| 87069-1 | Guidance for hemodynamic evaluation of Liver |
| 87070-9 | Guidance for microwave ablation of Liver |
| 87071-7 | Guidance for radiofrequency ablation of Liver |
| 87072-5 | Guidance for placement of TIPS of Liver |
| 87073-3 | Guidance for revision of TIPS of Liver |
| 87074-1 | Guidance for transhepatic revision of tube of Liver |
| 87075-8 | Guidance for transjugular biopsy of Liver |
| 87076-6 | Guidance for transjugular biopsy and hemodynamic evaluation of Liver |
| 87077-4 | Guidance for transjugular biopsy and venography of Liver |
| 87078-2 | Guidance for percutaneous drainage and placement of drainage catheter of Abdomen |
| 87079-0 | Guidance for paracentesis and insertion of tube of Peritoneum |
| 87080-8 | Guidance for paracentesis of Peritoneum |
| 87081-6 | Guidance for placement of catheter in Peritoneum |
| 87082-4 | Guidance for removal of catheter from Peritoneum |
| 87083-2 | Guidance for reposition of catheter in Peritoneum |
| 87084-0 | Guidance for removal of foreign body from Peritoneum |
| 87085-7 | Guidance for placement of port in Peritoneum |
| 87086-5 | Guidance for removal of port from Peritoneum |
| 87087-3 | Guidance for percutaneous transluminal angioplasty of Renal artery |
| 87088-1 | Guidance for puncture of Lumbar spine |
| 87089-9 | Guidance for kyphoplasty of Lumbar spine |
| 87090-7 | Guidance for myelography of Lumbar spine |
| 87091-5 | Guidance for vertebroplasty of Lumbar spine |
| 87092-3 | Guidance for placement of venous filter in Inferior vena cava |
| 87093-1 | Guidance for removal of venous filter from Inferior vena cava |
| 87094-9 | Guidance for reposition of venous filter in Inferior vena cava |
| 87095-6 | Guidance for percutaneous transluminal angioplasty of Visceral artery |
| 87096-4 | Guidance for placement of stent in Visceral artery |
| 87097-2 | Guidance for placement of peritoneovenous shunt in Chest and Abdomen |
| 87098-0 | Guidance for removal of peritoneovenous shunt from Chest and Abdomen |
| 87099-8 | Guidance for revision of peritoneovenous shunt of Chest and Abdomen |
| 87100-4 | Guidance for percutaneous transluminal angioplasty of Thoracic and abdominal aorta |
| 87101-2 | Guidance for percutaneous transluminal angioplasty of Brachiocephalic artery |
| 87102-0 | Guidance for initial day infusion of thrombolytic of Chest-- W thrombolytic via chest tube |
| 87103-8 | Guidance for infusion of thrombolytic of Chest-- W thrombolytic via CVC |
| 87104-6 | Guidance for injection of CV catheter of Chest |
| 87105-3 | Guidance for reposition of CV catheter in Chest |
| 87106-1 | Guidance for placement of CV catheter with port in Chest |
| 87107-9 | Guidance for removal of CV catheter with port from Chest |
| 87108-7 | Guidance for repair of CV catheter with port of Chest |
| 87109-5 | Guidance for placement of Swan-Ganz catheter in Chest |
| 87110-3 | Guidance for thoracentesis and insertion of tube of Chest |
| 87111-1 | Guidance for thoracentesis of Chest |
| 87112-9 | Guidance for exchange of tunneled CV catheter without port of Chest |
| 87113-7 | Guidance for placement of tunneled CV catheter without port in Chest |
| 87114-5 | Guidance for removal of tunneled CV catheter without port from Chest |
| 87115-2 | Guidance for repair of non-tunneled CV catheter without port of Chest |
| 87116-0 | Guidance for placement of chest tube in Pleural space |
| 87118-6 | Guidance for placement of fiducial marker in Lung |
| 87119-4 | Guidance for microwave ablation of Lung |
| 87120-2 | Guidance for radiofrequency ablation of Lung |
| 87121-0 | Guidance for placement of tunneled catheter in Chest Pleura |
| 87122-8 | Guidance for kyphoplasty of Thoracic spine |
| 87123-6 | Guidance for myelography of Thoracic spine |
| 87124-4 | Guidance for vertebroplasty of Thoracic spine |
| 87125-1 | Guidance for nerve block of Thoracic spine intercostal nerve |
| 87126-9 | Guidance for removal of venous filter from Superior vena cava |
| 87127-7 | Guidance for reposition of venous filter in Superior vena cava |
| 87128-5 | Guidance for placement of venous filter in Superior vena cava |
| 87129-3 | Guidance for percutaneous transluminal angioplasty of Lower leg |
| 87130-1 | Guidance for laser ablation of Extremity vein |
| 87131-9 | Guidance for greater than 20 stab phlebectomy of Extremity vein |
| 87132-7 | Guidance for injection of Ankle |
| 87133-5 | Guidance for percutaneous transluminal angioplasty of Femoral artery and Popliteal artery |
| 87134-3 | Guidance for placement of stent in Femoral artery and Popliteal artery |
| 87135-0 | Guidance for injection of Hip |
| 87136-8 | Guidance for arthrocentesis of Knee |
| 87137-6 | Guidance for injection of Knee |
| 87138-4 | Guidance for additional laser ablation of Extremity vein |
| 87139-2 | Guidance for additional transluminal angioplasty of Lower leg |
| 87140-0 | Guidance for additional placement of stent of Lower leg vessel |
| 87141-8 | Guidance for placement of CV catheter with port in Upper extremity |
| 87142-6 | Guidance for exchange of CV catheter with port of Upper extremity |
| 87143-4 | Guidance for exchange of peripherally inserted central catheter of Upper extremity |
| 87144-2 | Guidance for placement of peripherally-inserted central venous catheter in Upper extremity |
| 87145-9 | Guidance for embolization of Brachial artery |
| 87146-7 | Guidance for injection of Shoulder |
| 87147-5 | Guidance for injection of Wrist |
| 87148-3 | Guidance for injection of thrombin for pseudoaneurysm |
| 87149-1 | Guidance for exchange of chest tube of Chest |
| 87150-9 | Guidance for percutaneous transluminal angioplasty of Iliac artery |
| 87151-7 | Guidance for placement of stent in Iliac artery |
| 87152-5 | Guidance for exchange of ureterostomy through ileal conduit of Ureter |
| 87153-3 | Guidance for therapeutic puncture and drainage of Cervical spine |
| 87154-1 | Guidance for diagnostic puncture of Cervical spine |
| 87155-8 | Guidance for fine needle aspiration of Thyroid gland |
| 87156-6 | Guidance for percutaneous biopsy.core needle of Thyroid gland |
| 87157-4 | Guidance for injection of platelet rich plasma |
| 87158-2 | Guidance for injection of Tendon |
| 87159-0 | Guidance for injection of Temporomandibular joint |
| 87160-8 | Guidance for injection of Spine facet joint |
| 87161-6 | Guidance for injection of Spine epidural space |
| 87162-4 | Guidance for placement of needle |
| 87163-2 | Guidance for placement of endovascular device in Vein |
| 87164-0 | Guidance for secondary mechanical thrombectomy of Artery |
| 87165-7 | Guidance for placement of endograft in Iliac artery |
| 87166-5 | Guidance for percutaneous transluminal angioplasty of Vein |
| 87167-3 | Guidance for transcatheter biopsy |
| 87168-1 | Guidance for transcatheter placement of stent |
| 87169-9 | Guidance for initial mechanical thrombectomy of Artery |
| 87170-7 | Guidance for ligation of Lymphatic vessel |
| 87171-5 | Guidance for placement of clip |
| 87172-3 | Guidance for placement of clip-- preoperative |
| 87173-1 | Guidance for biopsy of Prostate |
| 87174-9 | Guidance for biopsy of Muscle |
| 87175-6 | Guidance for deep drainage and placement of drainage catheter of Pelvis |
| 87176-4 | Guidance for radiofrequency ablation of Bone |
| 87177-2 | Guidance for radiofrequency ablation of Chest Pleura |
| 87178-0 | Guidance for final day of infusion of thrombolytic of Vessel-- W thrombolytic via catheter |
| 87179-8 | Guidance for fine needle aspiration |
| 87180-6 | Guidance for dilation of Fallopian tube |
| 87181-4 | Guidance for embolization of Uterine artery |
| 87182-2 | Guidance for placement of wire |
| 87183-0 | Guidance for greater than 2 injections of trigger point of Muscle |
| 87184-8 | Guidance for percutaneous transluminal angioplasty of arterial anastomosis of Artery |
| 87185-5 | Guidance for sympathectomy of Nerve |
| 87186-3 | Guidance for mechanical thrombectomy of central venous catheter lumen obstruction |
| 87187-1 | Guidance for nerve block of Nerve root |
| 87188-9 | Guidance for exchange of nephroureteral stent of Kidney and Ureter and Urinary bladder |
| 87189-7 | Guidance for transurethral removal of nephroureteral stent of Kidney and Ureter and Urinary bladder |
| 87190-5 | Guidance for percutaneous placement of nephroureteral stent of Kidney and Ureter and Urinary bladder |
| 87191-3 | Guidance for removal of nephroureteral stent of Kidney and Ureter and Urinary bladder |
| 87192-1 | Guidance for thrombectomy |
| 87193-9 | Guidance for initial day infusion of thrombolytic of Artery-- W thrombolytic via catheter |
| 87194-7 | Guidance for initial mechanical thrombectomy of Vein |
| 87195-4 | Guidance for initial day infusion of thrombolytic of Vein-- W thrombolytic via catheter |
| 87196-2 | Guidance for infusion of non-thrombolytic of Vessel |
| 87197-0 | Guidance for retrieval of foreign body of Vessel |
| 87198-8 | Guidance for placement of drainage catheter for abscess |
| 87199-6 | Guidance for substance removal of central venous catheter pericatheter obstruction |
| 87200-2 | Guidance for placement of stent in Artery |
| 87201-0 | Guidance for treatment of AV fistula |
| 87202-8 | Guidance for venous sampling of Vein |
| 87203-6 | Guidance for transurethral exchange of nephroureteral stent of Kidney and Ureter and Urinary bladder |
| 87205-1 | Guidance for exchange of non-tunneled CV catheter of Chest |
| 87206-9 | Guidance for nerve block of Peripheral nerve |
| 87279-6 | CT Chest for screening |
| 87280-4 | CTA Abdominal veins and Pelvis veins and Lower extremity veins - bilateral W contrast IV |
| 87281-2 | CTA Lower extremity veins - bilateral W contrast IV |
| 87308-3 | Guidance for transhepatic removal of catheter of Biliary ducts |
| 87309-1 | Guidance for transhepatic placement of catheter of Biliary ducts |
| 87310-9 | Guidance for transhepatic exchange of catheter of Biliary ducts |
| 87311-7 | Guidance for embolization for tumor, ischemia or infarction of Vessel |
| 87312-5 | Guidance for percutaneous transluminal angioplasty for dialysis of Vein |
| 87836-3 | CTA Hepatic vessels WO and W contrast IV |
| 87837-1 | CTA Aortic valve W contrast IV |
| 87838-9 | CTA Abdominal veins and Pelvis veins W contrast IV |
| 87839-7 | CTA Pulmonary veins W contrast IV |
| 87840-5 | CTA Coronary arteries and Pulmonary arteries W contrast IV |
| 87841-3 | CTA Coronary arteries and Thoracic aorta W contrast IV |
| 87842-1 | CTA Coronary arteries and Pulmonary arteries and Thoracic aorta W contrast IV |
| 87843-9 | CTA Pelvis veins and Lower extremity veins - bilateral |
| 87844-7 | CTA Pelvis veins |
| 87845-4 | CTA Lower extremity vessels |
| 87846-2 | CTA Renal vessels WO and W contrast IV |
| 87847-0 | CT Chest WO and CT angiogram Coronary arteries W contrast IV |
| 87848-8 | CTA Pulmonary arteries - bilateral and Lower extremity veins - bilateral for pulmonary embolus and deep vein thrombosis W contrast IV |
| 87849-6 | CTA Pulmonary arteries - bilateral and Lower extremity veins - bilateral for pulmonary embolus and deep vein thrombosis |
| 87850-4 | CTA Deep inferior epigastric artery WO and W contrast IV |
| 87851-2 | CTA Mesenteric vessels W contrast IV |
| 87852-0 | CTA Mesenteric vessels WO and W contrast IV |
| 87853-8 | CT Abdomen and Pelvis and CT angiogram Abdominal aorta WO and W contrast IV |
| 87854-6 | CT Abdomen and Pelvis and CT angiogram Abdominal aorta W contrast IV |
| 87855-3 | CTA Circle of Willis and Carotid arteries WO and W contrast IV |
| 87856-1 | CTA Circle of Willis and Carotid arteries W contrast IV |
| 87857-9 | CTA Thoracic and abdominal aorta WO and W contrast IV |
| 87858-7 | CTA Deep inferior epigastric artery W contrast IV |
| 87859-5 | CT Thoracic Aorta WO and W contrast IV |
| 87860-3 | CT Thoracic Aorta WO contrast |
| 87861-1 | CT Thoracic and abdominal aorta WO and W contrast IV |
| 87862-9 | CT Abdomen WO and CT Abdomen and Pelvis W contrast IV |
| 87863-7 | CT Abdomen WO and CT Chest and Abdomen W contrast IV |
| 87864-5 | CT Abdomen WO and CT Chest and Abdomen and Pelvis W contrast IV |
| 87865-2 | CT Abdomen and Pelvis WO and CT Chest and Abdomen and Pelvis W contrast IV |
| 87866-0 | CT Kidney and Ureter and Urinary bladder WO and W contrast IV |
| 87867-8 | CT Lumbar spine by reconstruction |
| 87868-6 | CT Lumbar spine by reconstruction WO and W contrast IV |
| 87869-4 | CT Chest and Abdomen and Pelvis |
| 87870-2 | CT Cervical spine to Coccyx WO and W contrast IV |
| 87871-0 | CT Clavicle - left |
| 87872-8 | CT Clavicle - right |
| 87873-6 | CT Lung parenchyma WO and W contrast IV |
| 87874-4 | CT Mediastinum W contrast IV |
| 87875-1 | CT Thoracic spine by reconstruction |
| 87876-9 | CT Thymus gland |
| 87877-7 | CT Neck and Chest WO contrast |
| 87878-5 | CT Knee - bilateral Arthrogram |
| 87879-3 | CT Lower leg - bilateral WO contrast |
| 87880-1 | CT Thigh - bilateral W contrast IV |
| 87881-9 | CT Thigh - bilateral WO contrast |
| 87882-7 | CT Lower leg - left |
| 87883-5 | CT Upper extremity - bilateral WO and W contrast IV |
| 87884-3 | CT Shoulder - bilateral Arthrogram |
| 87885-0 | CT Upper arm - bilateral WO contrast |
| 87886-8 | CT Finger fifth - left WO contrast |
| 87887-6 | CT Finger fourth - left W contrast IV |
| 87888-4 | CT Finger second - left WO contrast |
| 87889-2 | CT Thumb - left WO contrast |
| 87890-0 | CT Finger fifth - right WO contrast |
| 87891-8 | CT Finger fourth - right WO contrast |
| 87892-6 | CT Finger second - right WO contrast |
| 87893-4 | CT Finger third - right WO contrast |
| 87894-2 | CT Thumb - right WO contrast |
| 87895-9 | CT Finger WO contrast |
| 87896-7 | CT Teeth W contrast IV |
| 87897-5 | CT Head and Pituitary and Sella turcica W contrast IV |
| 87898-3 | CT Teeth.maxilla WO contrast |
| 87899-1 | CT Teeth.mandible WO contrast |
| 87900-7 | CT Mastoid W contrast IV |
| 87901-5 | CT Temporal bone - bilateral WO and W contrast IV |
| 87902-3 | CT Temporal bone - bilateral W contrast IV |
| 87903-1 | CT Temporal bone - bilateral WO contrast |
| 87904-9 | CT Temporomandibular joint - bilateral WO contrast |
| 87905-6 | PET+CT Guidance for localization of tumor of Head and Neck-- W 18F-FDG IV |
| 87906-4 | CT Maxillofacial region - right W contrast IV |
| 87907-2 | PET+CT Brain for amyloidosis |
| 87908-0 | CT Head and Maxillofacial region W contrast IV |
| 87909-8 | CT Temporomandibular joint Arthrogram |
| 87910-6 | CT Head and Sinuses WO and W contrast IV |
| 87911-4 | CT Head and Maxillofacial region WO and W contrast IV |
| 87912-2 | CT Sinuses and Orbit WO contrast |
| 87913-0 | CT Pelvis by reconstruction |
| 87914-8 | CT Pelvis bones WO and W contrast IV |
| 87915-5 | PET+CT Guidance for localization of tumor of Skull vertex to mid-thigh-- W 18F-FDG IV and W contrast IV |
| 87916-3 | CT Guidance for injection of cyst of Unspecified body region |
| 87917-1 | CT Pelvis bones WO contrast |
| 87918-9 | CT Parathyroid gland WO and W contrast IV |
| 87919-7 | CT Pelvis bones |
| 87920-5 | CT Pelvis bones W contrast IV |
| 87921-3 | CT Trachea WO contrast |
| 87922-1 | CT Cervical and thoracic spine W contrast IT |
| 88242-3 | Guidance for infusion of non-thrombolytic of Head Arteries |
| 88243-1 | Guidance for removal of tunneled catheter from Chest Pleura |
| 88315-7 | CT Head WO contrast and CT Brain for perfusion W contrast IV and CT angiogram Head and neck vessels W contrast IV |
| 88316-5 | CT Guidance for biopsy of Spinal cord |
| 88317-3 | CT Guidance for fluid aspiration of Chest |
| 88318-1 | CTA Coronary arteries and Pulmonary veins W contrast IV |
| 88319-9 | CT Abdomen and Pelvis and Lower extremity - bilateral W contrast IV |
| 88320-7 | CT Neck W contrast IV and CT angiogram Head and neck vessels W contrast IV |
| 88321-5 | CT Guidance for stereotactic localization of Unspecified body region |
| 88322-3 | CT Chest W contrast IV and CT angiogram Pulmonary arteries for pulmonary embolus W contrast IV |
| 88323-1 | CT Guidance for biopsy of Kidney - right |
| 88324-9 | CT Guidance for biopsy of Lung - left |
| 88325-6 | CT Guidance for biopsy of Kidney - left |
| 88326-4 | CT Head WO contrast and CT Brain for perfusion W contrast IV and CT angiogram Head vessels W contrast IV |
| 88327-2 | CT Head W contrast IV and CT angiogram Head and neck vessels W contrast IV |
| 88349-6 | Guidance-- during surgery |
| 88526-9 | CT Guidance for biopsy of Lung - right |
| 88831-3 | RF Kidney - right and Ureter Views W contrast retrograde intra ureter |
| 88832-1 | RF Kidney - left and Ureter Views W contrast retrograde intra ureter |
| 88833-9 | RF Kidney - bilateral and Ureter Views W contrast retrograde intra ureter |
| 88834-7 | RF Guidance for dilation of nephrostomy tract, ureter, or urethra |
| 88929-5 | Guidance for additional transluminal angioplasty of Vein |
| 88930-3 | Guidance for dilation of stricture and placement of stent of Biliary ducts-- W contrast IV |
| 88931-1 | Guidance for embolization for tumor of Hepatic artery-- W embolic agent IA |
| 88932-9 | Guidance for embolization for tumor of Spinal artery-- W embolic agent IA |
| 88933-7 | Guidance for embolization of Portal vein-- W embolic agent IV |
| 88934-5 | Guidance for embolization of Splenic artery-- W embolic agent IA |
| 88935-2 | Guidance for chemoembolization of Hepatic artery-- W chemotherapy IA+W embolic agent IA |
| 88936-0 | Guidance for injection of Hepatic artery-- W Tc-99m MAA IA |
| 88937-8 | Guidance for placement of stent in Biliary ducts |
| 88938-6 | Guidance for placement of stent in Ureter |
| 88939-4 | Guidance for radioembolization for tumor of Hepatic artery-- W Yttrium-90 IA |
| 88940-2 | Guidance for repair of aneurysm of Abdominal Aorta |
| 88941-0 | Guidance for repair of aneurysm of Thoracic Aorta |
| 88942-8 | Guidance for repair of endoleak of Artery |
| 88943-6 | Guidance for venous sampling of Adrenal vein |
| 88944-4 | NM Lung and Liver Views for AV shunt W Tc-99m MAA+W intraarterial hepatic injection |
| 89283-6 | CT Neck+Chest+Abdomen+Pelvis W contrast IV |
| 89284-4 | MR Cervical and thoracic spine W contrast IV |
| 89602-7 | CT Guidance for aspiration of cyst of Kidney - left |
| 89603-5 | CT Guidance for aspiration of cyst of Kidney - right |
| 89604-3 | CT Guidance for aspiration of cyst of Kidney - bilateral |
| 89605-0 | CT Guidance for ablation of tissue of Kidney - right |
| 89606-8 | CT Guidance for ablation of tissue of Kidney - left |
| 89607-6 | CT Guidance for fluid aspiration of Lung - right |
| 89608-4 | CT Guidance for fluid aspiration of Lung - left |
| 89609-2 | CT Guidance for fluid aspiration of Pericardial space |
| 89610-0 | CT Guidance for placement of catheter in Peritoneal space |
| 89611-8 | CT Guidance for fluid aspiration of Pleural space - right |
| 89612-6 | CT Guidance for fluid aspiration of Pleural space - left |
| 89613-4 | CT Guidance for drainage and placement of drainage catheter of Abdomen-- WO contrast |
| 89614-2 | CT Guidance for biopsy of Kidney-- WO contrast |
| 89615-9 | CT Guidance for drainage and placement of drainage catheter of Abdomen-- W contrast IV |
| 89616-7 | CT Guidance for aspiration of cyst of Pancreas-- WO contrast |
| 89617-5 | CT Guidance for aspiration of cyst of Kidney-- W contrast IV |
| 89618-3 | CT Guidance for aspiration of cyst of Kidney-- WO contrast |
| 89619-1 | CT Guidance for biopsy of Pancreas-- W contrast IV |
| 89620-9 | CT Guidance for biopsy of Abdomen-- W contrast IV |
| 89621-7 | CT Guidance for biopsy of Kidney-- W contrast IV |
| 89622-5 | CT Guidance for fluid aspiration of Peritoneal space |
| 89623-3 | CT Guidance for drainage and placement of drainage catheter of Peritoneal space |
| 89624-1 | CT Guidance for drainage of abscess and placement of drainage catheter of Peritoneal space |
| 89625-8 | CT Guidance for aspiration of cyst of Kidney |
| 89626-6 | CTA Abdominal, Pelvis and Lower extremity vessels W contrast IV |
| 89627-4 | CT Guidance for aspiration of cyst of Ileum - right |
| 89628-2 | CT Guidance for aspiration of cyst of Ileum - left |
| 89629-0 | CT Guidance for aspiration of cyst of Lung - left |
| 89630-8 | CT Guidance for aspiration of cyst of Lung - right |
| 89631-6 | SPECT+CT Guidance for localization of tumor of Whole body |
| 89695-1 | CT Guidance for drainage and placement of drainage catheter of Pelvis-- WO contrast |
| 89696-9 | CT Guidance for drainage and placement of drainage catheter of Pelvis-- W contrast IV |
| 89697-7 | CT Guidance for drainage of pseudocyst and placement of drainage catheter of Pancreas |
| 89698-5 | CT Guidance for injection of Ankle - right |
| 89699-3 | CT Guidance for injection of Ankle - left |
| 89700-9 | CT Guidance for injection of Hip - right |
| 89701-7 | CT Guidance for injection of Hip - left |
| 89702-5 | CT Guidance for injection of Shoulder - bilateral |
| 89703-3 | CT Guidance for injection of Shoulder - left |
| 89704-1 | CT Guidance for injection of Shoulder - right |
| 89705-8 | CT Guidance for injection of Wrist - left |
| 89706-6 | CT Guidance for injection of Knee - bilateral |
| 89707-4 | CT Guidance for injection of Knee - right |
| 89708-2 | CT Guidance for injection of Knee - left |
| 89709-0 | CT Guidance for greater than 2 levels for injection of Spine facet joint |
| 89710-8 | CT Guidance for 2 levels injection of Spine facet joint |
| 89711-6 | CT Guidance for 1 level injection of Spine facet joint |
| 89712-4 | PET+CT Guidance for limited for localization of tumor of Unspecified body region-- W 18F-FDG IV and W contrast IV |
| 89713-2 | CT Upper extremity joint - right Arthrogram |
| 89714-0 | CT Upper extremity joint - left Arthrogram |
| 89715-7 | CT Lower extremity joint - right Arthrogram |
| 89716-5 | CT Lower extremity joint - left Arthrogram |
| 89717-3 | CT Guidance for stereotactic localization of Unspecified body region-- WO and W contrast IV |
| 89718-1 | CT Guidance for stereotactic localization of Unspecified body region-- W contrast IV |
| 89719-9 | CT Guidance for drainage of abscess and placement of drainage catheter of Lung - right |
| 89720-7 | CT Guidance for drainage of abscess and placement of drainage catheter of Lung - left |
| 89721-5 | CT Guidance for drainage of abscess and placement of drainage catheter of Retroperitoneum |
| 89722-3 | CTA Upper extremity veins - left W contrast IV |
| 89723-1 | CTA Upper extremity veins - right W contrast IV |
| 89827-0 | CT Spine Lumbar and Sacrum WO and W contrast IV |
| 89828-8 | CT Guidance for superficial biopsy of Muscle |
| 89829-6 | CT Guidance for biopsy of Retroperitoneum-- WO contrast |
| 89830-4 | CT Guidance for biopsy of Retroperitoneum-- W contrast IV |
| 89831-2 | CT Guidance for drainage and placement of drainage catheter of Subphrenic space |
| 89832-0 | CT Guidance for deep biopsy of Tissue |
| 89833-8 | CT Unspecified body region by reconstruction |
| 89834-6 | CT Clavicle - bilateral WO contrast |
| 89835-3 | CT Brachial plexus W contrast IV |
| 89836-1 | CT Brachial plexus WO contrast |
| 89837-9 | CT Temporal bone - left WO and W contrast IV |
| 89838-7 | CT Temporal bone - right WO and W contrast IV |
| 89839-5 | CT Guidance for biopsy of Sternum |
| 89840-3 | CT Lumbosacral plexus WO contrast |
| 89841-1 | CTA Upper extremity vessels - bilateral WO and W contrast IV |
| 89842-9 | SPECT+CT Whole body |
| 89844-5 | CT Head and Temporal bone WO and W contrast IV |
| 89845-2 | CT Head and Orbit - bilateral WO and W contrast IV |
| 89846-0 | CT Midfoot - left and Forefoot - left WO and W contrast IV |
| 89847-8 | CT Midfoot - right and Forefoot - right |
| 89848-6 | CT Midfoot - right WO and W contrast IV |
| 89849-4 | CT Finger - right WO contrast |
| 89850-2 | CT Finger - left WO contrast |
| 89851-0 | CTA Unspecified body region limited |
| 89852-8 | CT Unspecified body region limited W contrast IV |
| 89853-6 | CT Unspecified body region limited WO contrast |
| 89854-4 | CT Guidance for drainage of abscess and placement of drainage catheter of Perirenal space - left |
| 89855-1 | CT Guidance for drainage of abscess and placement of drainage catheter of Perirenal space - right |
| 89856-9 | CT Guidance for stereotactic localization of Unspecified body region-- WO contrast |
| 89857-7 | CT Guidance for biopsy of Pleura - right |
| 89858-5 | CT Guidance for biopsy of Pleura - left |
| 89859-3 | CT Guidance for transrectal drainage of abscess of Pelvis |
| 89860-1 | CT Chest W inspiration and expiration |
| 89925-2 | CT Pelvis and Lower extremity - bilateral WO and W contrast IV |
| 89928-6 | CT Guidance for fluid aspiration of Lumbar spine Intervertebral disc |
| 89929-4 | CT Guidance for fluid aspiration of Intervertebral disc |
| 89930-2 | CT Guidance for radiofrequency ablation of Bone |
| 89931-0 | CT Guidance for drainage and placement of drainage catheter of Perirectal region |
| 89932-8 | CT Guidance for deep placement of needle of Unspecified body region |
| 89952-6 | CT Guidance for arthrocentesis of Sacroiliac joint - right |
| 89953-4 | CT Guidance for arthrocentesis of Shoulder - right |
| 89954-2 | CT Guidance for arthrocentesis of Shoulder - left |
| 89955-9 | CT Guidance for arthrocentesis of Hip - bilateral |
| 89956-7 | CT Guidance for arthrocentesis of Hip - left |
| 89957-5 | CT Guidance for arthrocentesis of Hip - right |
| 89958-3 | CT Guidance for cryoablation of Pelvis |
| 89959-1 | CT Guidance for biopsy of Soft tissue |
| 89960-9 | CT Guidance for drainage of abscess and placement of drainage catheter of Kidney - right |
| 89961-7 | CT Guidance for drainage of abscess and placement of drainage catheter of Kidney - left |
| 89962-5 | CT Guidance for radiofrequency ablation of Lung |
| 90049-8 | CT Guidance for placement of chest tube in Pleural space - left |
| 90050-6 | CT Guidance for placement of chest tube in Pleural space - bilateral |
| 90051-4 | CT Guidance for placement of chest tube in Pleural space - right |
| 90307-0 | CT Guidance for injection of Foot joint - right |
| 90308-8 | CT Guidance for needle localization of Thoracic spine |
| 90309-6 | CT Guidance for drainage and placement of drainage catheter of Lung - right |
| 90310-4 | CT Guidance for drainage and placement of drainage catheter of Retroperitoneum-- WO contrast |
| 90311-2 | CT Guidance for percutaneous replacement of drainage catheter of Unspecified body region |
| 90312-0 | SPECT+CT Skeletal system |
| 90313-8 | CT Guidance for drainage and placement of chest tube of Pleural space - left |
| 90314-6 | CT Guidance for drainage and placement of drainage catheter of Retroperitoneum-- W contrast IV |
| 90315-3 | CT Guidance for deep biopsy of Soft tissue |
| 90316-1 | CT Guidance for superficial biopsy of Soft tissue |
| 90317-9 | CT Guidance for drainage and placement of drainage catheter of Lower extremity - left |
| 90318-7 | CT Guidance for drainage and placement of drainage catheter of Lower extremity - right |
| 90319-5 | CT Guidance for drainage and placement of drainage catheter of Lung - left |
| 90334-4 | CT Guidance for injection of Spine Thoracic Facet Joint |
| 90335-1 | CT Guidance for injection of Lumbar Spine Facet Joint |
| 90336-9 | CT Guidance for injection of Muscle |
| 90352-6 | CT Head and CT Brain for perfusion and CT angiogram Head vessels WO and W contrast IV |
| 90372-4 | CT Guidance for injection of Tendon |
| 90373-2 | CT Guidance for injection of Tendon or ligament |
| 91517-3 | DBT Breast - right diagnostic for implant |
| 91518-1 | DBT Breast - left diagnostic for implant |
| 91519-9 | DBT Breast - bilateral diagnostic for implant |
| 91520-7 | DBT Breast - right screen for implant |
| 91521-5 | DBT Breast - left screen for implant |
| 91522-3 | DBT Breast - bilateral screen for implant |
| 91523-1 | MR Chest and Abdomen and Pelvis W contrast IV |
| 91524-9 | MR Chest and Abdomen and Pelvis WO and W contrast IV |
| 91525-6 | MR Chest and Abdomen and Pelvis WO contrast |
| 91561-1 | MR Cervical and thoracic and lumbar spine W contrast IV |
| 91591-8 | MR Brain and Orbit - bilateral W contrast IV |
| 91592-6 | MR Brain and Orbit - bilateral WO and W contrast IV |
| 91593-4 | MR Brain and Orbit - bilateral WO contrast |
| 91594-2 | MR Sacrum and Sacroiliac joint W contrast IV |
| 91595-9 | MR Sacrum and Sacroiliac joint WO and W contrast IV |
| 91596-7 | MR Sacrum and Sacroiliac joint WO contrast |
| 91597-5 | MR Toe WO and W contrast IV |
| 91598-3 | XR Knee GE 2 Views |
| 91715-3 | MR Spine Lumbar and Sacrum W contrast IV |
| 91716-1 | MR Spine Lumbar and Sacrum WO and W contrast IV |
| 91717-9 | MR Spine Lumbar and Sacrum WO contrast |
| 91718-7 | MR Unspecified body region Post mortem |
| 91719-5 | CT Unspecified body region Post mortem |
| 91720-3 | XR Head to Abdomen Views for shunt patency |
| 92025-6 | CT Head and Cervical spine W contrast IV |
| 92567-7 | CT Guidance for percutaneous drainage and placement of drainage catheter of Unspecified body region |
| 92569-3 | CT Guidance for drainage and placement of chest tube of Pleural space - bilateral |
| 92571-9 | CT Guidance for drainage and placement of chest tube of Pleural space - right |
| 92677-4 | XR Pelvis and Hip GE 4 Views |
| 92678-2 | US.elastography Lung |
| 92679-0 | US.elastography Lung for lesion |
| 92680-8 | US.elastography Lung additional for lesion |
| 92681-6 | Guidance for dilation of existing nephrostomy tract of Kidney |
| 92682-4 | Guidance for dilation of existing nephrostomy tract and placement of nephrostomy tube at new site of Kidney |
| 92916-6 | CT Guidance for aspiration of Retroperitoneum |
| 92917-4 | CT Guidance for aspiration of Kidney - right |
| 92918-2 | CT Guidance for aspiration of Kidney - left |
| 92919-0 | CT Guidance for 2 levels injection of Spine Lumbar and Sacrum |
| 92920-8 | CT Guidance for 1 level injection of Spine Lumbar and Sacrum |
| 92921-6 | CT Guidance for 1 level injection of Cervical and thoracic spine |
| 92922-4 | CT Guidance for intrathecal injection of Lumbar spine |
| 92923-2 | CT Guidance for aspiration of Kidney |
| 92924-0 | CT Guidance for aspiration of Abdomen |
| 92925-7 | CT Guidance for injection of Spine cervical and thoracic epidural space |
| 92926-5 | CT Guidance for radiation treatment of Unspecified body region-- WO and W contrast IV |
| 92927-3 | PET+CT Brain for tau protein |
| 92928-1 | CT Guidance for injection of Spine lumbar and Sacrum epidural space |
| 93241-8 | US.doppler Unspecified body region |
| 93603-9 | CT Head and Cervical spine WO and W contrast IV |
| 93604-7 | US.doppler Lower extremity arteries+veins - bilateral |
| 93605-4 | XR Skull to Coccyx 2 or 3 Views |
| 93606-2 | XR Skull to Coccyx 4 or 5 Views |
| 93607-0 | XR Skull to Coccyx GE 6 Views |
| 94088-2 | MR Thoracic and lumbar spine WO and W contrast |
| 94089-0 | MR Chest WO and W contrast IV and MRA Chest W contrast IV |
| 94090-8 | RFA Views for dialysis fistula W contrast IA and Guidance for percutaneous transluminal angioplasty transcatheter placement of stent |
| 94091-6 | RFA Views for dialysis fistula W contrast IA and Guidance for percutaneous transluminal angioplasty |
| 94092-4 | RFA Views for dialysis fistula W contrast IA |
| 94094-0 | RFA Unspecified body region Limited Views for therapy or embolization or infusion W contrast via existing catheter |
| 94095-7 | RFA Extremity vessels Unilateral Views W contrast IV |
| 94678-0 | NM Liver and Biliary ducts and Gallbladder Views for patency |
| 94679-8 | XR Chest Single View and Abdomen Supine and Upright and Lateral-decubitus |
| 94680-6 | US.doppler Thoracic and Abdominal Aorta and Inferior Vena Cava and Illiac vessels limited |
| 94681-4 | US.doppler Thoracic and Abdominal Aorta and Inferior Vena Cava and Illiac vessels |
| 94682-2 | XR Calcaneus GE 2 Views |
| 94683-0 | XR Pelvis and Hip - unilateral GE 2 Views |
| 94684-8 | XR Spine Lumbar and Sacrum GE 6 Views W right bending and W left bending |
| 94685-5 | XR Ribs - unilateral GE 3 Views and Chest PA |
| 94686-3 | MR Brain WO and W contrast IV and MRA Brain WO contrast |
| 94687-1 | CTA Abdominal vessels and Pelvis vessels WO contrast |
| 94688-9 | CTA Neck vessels and Chest vessels WO and W contrast IV |
| 95610-2 | XR Teeth Complete Views |
| 95611-0 | XR Teeth Occlusal Views |
| 95612-8 | Portable XR Unspecified body region Views |
| 95924-7 | CT Skeletal system Multisection for bone density |
| 95925-4 | CT Skeletal system.axial Multisection for bone density |
| 95926-2 | CT Skeletal system.peripheral Multisection for bone density |
| 95927-0 | CT Radius Multisection for bone density |
| 95928-8 | CT Wrist Multisection for bone density |
| 95929-6 | CT Calcaneus Multisection for bone density |
| 97340-4 | XR Sternoclavicular joint - left AP |
| 97341-2 | XR Finger second - right AP |
| 97342-0 | XR Finger second - right PA |
| 97343-8 | XR Sternoclavicular joint - left PA |
| 97344-6 | XR Radius and Ulna - left PA |
| 97345-3 | XR Radius and Ulna - left Lateral |
| 97346-1 | XR Radius and Ulna - left AP |
| 97347-9 | XR Clavicle - left AP |
| 97348-7 | XR Clavicle - left Oblique |
| 97349-5 | XR Clavicle - left Axial |
| 97350-3 | XR Humerus - right Lateral |
| 97351-1 | XR Humerus - right AP |
| 97352-9 | XR Elbow - right Lateral |
| 97353-7 | XR Elbow - right AP |
| 97354-5 | XR Shoulder - right AP external rotation |
| 97355-2 | XR Shoulder - right AP internal rotation |
| 97356-0 | XR Sternoclavicular joint - right Oblique |
| 97357-8 | XR Sternoclavicular joint - right AP |
| 97358-6 | XR Sternoclavicular joint - right PA |
| 97359-4 | XR Radius and Ulna - right PA |
| 97360-2 | XR Radius and Ulna - right Lateral |
| 97361-0 | XR Radius and Ulna - right AP |
| 97362-8 | XR Clavicle - right AP |
| 97363-6 | XR Clavicle - right Oblique |
| 97364-4 | XR Clavicle - right Axial |
| 97365-1 | XR Ribs - left Oblique |
| 97366-9 | XR Ribs - left PA |
| 97367-7 | XR Shoulder AP external rotation |
| 97368-5 | XR Shoulder AP internal rotation |
| 97369-3 | XR Sternoclavicular joint - bilateral Oblique |
| 97370-1 | XR Sternoclavicular joint - bilateral PA |
| 97371-9 | XR Sternoclavicular joint - bilateral AP |
| 97372-7 | XR Radius and Ulna - bilateral AP |
| 97373-5 | XR Radius and Ulna - bilateral PA |
| 97374-3 | XR Radius and Ulna - bilateral Lateral |
| 97375-0 | XR Clavicle - bilateral AP and Oblique |
| 97376-8 | XR Clavicle - bilateral AP |
| 97377-6 | XR Clavicle - bilateral Oblique |
| 97378-4 | XR Humerus - left Lateral |
| 97379-2 | XR Humerus - left AP |
| 97380-0 | XR Elbow - left AP |
| 97381-8 | XR Shoulder - left AP external rotation |
| 97382-6 | XR Shoulder - left AP internal rotation |
| 97383-4 | XR Sternoclavicular joint - left Oblique |
| 97384-2 | XR Tibia and Fibula - left Lateral |
| 97385-9 | XR Tibia and Fibula - left AP |
| 97386-7 | XR Tibia and Fibula - right Lateral |
| 97387-5 | XR Tibia and Fibula - right AP |
| 97388-3 | XR Elbow - bilateral Lateral Views W manual stress |
| 97389-1 | XR Elbow - left Lateral Views W manual stress |
| 97390-9 | XR Elbow - right Lateral Views W manual stress |
| 97391-7 | MR Abdomen and Pelvis WO contrast |
| 97392-5 | MR Abdomen and Pelvis WO and W contrast IV |
| 97393-3 | MR Abdomen and Pelvis W contrast IV |
| 97394-1 | US Guidance for injection of Elbow - left |
| 97395-8 | US Guidance for injection of Elbow - right |
| 97396-6 | US Guidance for injection of Elbow - bilateral |
| 97397-4 | XR Finger third - left AP and Lateral |
| 97398-2 | XR Finger second - left AP and Lateral |
| 97399-0 | XR Finger fourth - left AP and Lateral |
| 97400-6 | XR Finger fifth - left AP and Lateral |
| 97401-4 | XR Finger third - left PA |
| 97402-2 | XR Finger fourth - right AP and Lateral |
| 97403-0 | XR Finger fifth - right AP and Lateral |
| 97404-8 | XR Finger second - right AP and Lateral |
| 97405-5 | XR Finger third - right AP and Lateral |
| 97406-3 | XR Finger third - right PA |
| 97407-1 | XR Shoulder - right Bernageau |
| 97408-9 | XR Shoulder - left Bernageau |
| 97409-7 | XR Toe fifth - left AP and Lateral and oblique |
| 97410-5 | XR Toe fourth - left AP and Lateral and oblique |
| 97411-3 | XR Toe third - left AP and Lateral and oblique |
| 97412-1 | XR Toe second - left AP and Lateral and oblique |
| 97413-9 | XR Great toe - left AP and Lateral and oblique |
| 97414-7 | XR Toe third - left AP and Lateral |
| 97415-4 | XR Toe fourth - left AP and Lateral |
| 97416-2 | XR Toe second - left AP and Lateral |
| 97417-0 | XR Toe fifth - left AP and Lateral |
| 97418-8 | XR Great toe - left AP and Lateral |
| 97419-6 | XR Toe third - right AP and Lateral and oblique |
| 97420-4 | XR Toe second - right AP and Lateral and oblique |
| 97421-2 | XR Finger second - left PA |
| 97422-0 | XR Finger second - left AP |
| 97423-8 | XR Finger second - bilateral AP |
| 97424-6 | XR Finger second - bilateral PA |
| 97425-3 | XR Finger fifth - right AP |
| 97426-1 | XR Finger fifth - left AP |
| 97427-9 | XR Finger fourth - left AP |
| 97428-7 | XR Finger fourth - right AP |
| 97429-5 | XR Finger third - left AP |
| 97430-3 | XR Finger third - right AP |
| 97431-1 | XR Finger fifth - left Lateral |
| 97432-9 | XR Finger fifth - right Lateral |
| 97433-7 | XR Finger fourth - right Lateral |
| 97434-5 | XR Finger fourth - left Lateral |
| 97435-2 | XR Finger second - right Lateral |
| 97436-0 | XR Finger second - left Lateral |
| 97437-8 | XR Finger third - left Lateral |
| 97438-6 | XR Finger third - right Lateral |
| 97439-4 | XR Finger fifth - right Oblique |
| 97440-2 | XR Finger fifth - left Oblique |
| 97441-0 | XR Finger fourth - left Oblique |
| 97442-8 | XR Finger fourth - right Oblique |
| 97443-6 | XR Finger second - right Oblique |
| 97444-4 | XR Finger second - left Oblique |
| 97445-1 | XR Finger third - right Oblique |
| 97446-9 | XR Finger third - left Oblique |
| 97447-7 | XR Ribs - right Oblique |
| 97448-5 | XR Ribs - right PA |
| 97449-3 | XR Great toe - bilateral AP |
| 97450-1 | XR Great toe - bilateral Oblique |
| 97451-9 | XR Great toe - bilateral Lateral |
| 97452-7 | XR Toe second - bilateral Oblique |
| 97453-5 | XR Toe fifth - bilateral Oblique |
| 97454-3 | XR Toe third - bilateral Oblique |
| 97455-0 | XR Toe third - bilateral AP |
| 97456-8 | XR Toe fourth - bilateral Oblique |
| 97457-6 | XR Toe fifth - bilateral AP |
| 97458-4 | XR Toe fourth - bilateral AP |
| 97459-2 | XR Toe second - bilateral AP |
| 97460-0 | XR Toe third - left Oblique |
| 97461-8 | XR Toe third - left AP |
| 97462-6 | XR Toe third - left Lateral |
| 97463-4 | XR Toe second - left Lateral |
| 97464-2 | XR Toe second - left AP |
| 97465-9 | XR Toe second - left Oblique |
| 97466-7 | XR Great toe - left Oblique |
| 97467-5 | XR Great toe - left Lateral |
| 97468-3 | XR Great toe - left AP |
| 97469-1 | XR Toe fourth - left AP |
| 97470-9 | XR Toe fourth - left Lateral |
| 97471-7 | XR Toe fourth - left Oblique |
| 97472-5 | XR Toe fifth - left Lateral |
| 97473-3 | XR Toe fifth - left Oblique |
| 97474-1 | XR Toe fifth - left AP |
| 97475-8 | XR Great toe - right AP |
| 97476-6 | XR Great toe - right Lateral |
| 97477-4 | XR Great toe - right Oblique |
| 97478-2 | XR Toe fifth - right Oblique |
| 97479-0 | XR Toe fifth - right AP |
| 97480-8 | XR Toe fifth - right Lateral |
| 97481-6 | XR Toe fourth - right Lateral |
| 97482-4 | XR Toe fourth - right AP |
| 97483-2 | XR Toe fourth - right Oblique |
| 97484-0 | XR Toe third - right Oblique |
| 97485-7 | XR Toe third - right Lateral |
| 97486-5 | XR Toe third - right AP |
| 97487-3 | XR Toe second - right Oblique |
| 97488-1 | XR Toe second - right Lateral |
| 97489-9 | XR Toe second - right AP |
| 97490-7 | XR Tibia and Fibula - bilateral AP |
| 97491-5 | XR Tibia and Fibula - bilateral Lateral |
| 97492-3 | XR Toe fifth - right AP and Lateral and oblique |
| 97493-1 | XR Toe fourth - right AP and Lateral and oblique |
| 97494-9 | XR Toe third - right AP and Lateral |
| 97495-6 | XR Great toe - right AP and Lateral |
| 97496-4 | XR Toe second - right AP and Lateral |
| 97497-2 | XR Toe fourth - right AP and Lateral |
| 97498-0 | XR Toe fifth - right AP and Lateral |
| 98033-4 | PET+CT Lower extremity |
| 98034-2 | RF Unspecified body region Limited Views |
| 98035-9 | US Eye |
| 98036-7 | NM Abdomen Views for therapy W Tc-99m SC IV |
| 98074-8 | CT Internal auditory canal - bilateral W contrast |
| 98282-7 | XR Stomach and Duodenum Views |
| 98283-5 | XR Gastrointestinal tract upper Views |
| 98284-3 | Guidance for myelography of Thoracic and lumbar spine |
| 98285-0 | Guidance for myelography of Cervical and thoracic and lumbar spine |
| 98286-8 | US.doppler Foot vessels - right |
| 98287-6 | US.doppler Foot vessels - bilateral |
| 98288-4 | US.doppler Foot vessels - left |
| 98289-2 | US.doppler Hand vessels - left |
| 98290-0 | US.doppler Hand vessels - bilateral |
| 98291-8 | US.doppler Hand vessels - right |
| 98292-6 | US.doppler Femoral artery and Popliteal artery - right |
| 98293-4 | US.doppler Femoral artery and Popliteal artery - left |
| 98294-2 | XR Lower extremity joint - bilateral Lateral Views W manual stress |
| 98295-9 | XR Lower extremity joint - left Lateral Views W manual stress |
| 98296-7 | XR Lower extremity joint - right Lateral Views W manual stress |
| 98297-5 | XR Foot cuneiform bones - right Views |
| 98298-3 | XR Forefoot - right Views |
| 98299-1 | XR Ankle - right Mortise W gravity stress |
| 98300-7 | XR Calcaneus - right LE 3 Broden Views |
| 98301-5 | XR Knee - right AP W varus stress |
| 98302-3 | XR Knee - right AP W valgus stress |
| 98303-1 | XR Calcaneus - right Lateral |
| 98304-9 | XR Calcaneus - right Canale |
| 98305-6 | XR Foot cuneiform bones - left Views |
| 98306-4 | XR Forefoot - left Views |
| 98307-2 | XR Ankle - left Mortise W gravity stress |
| 98308-0 | XR Calcaneus - left LE 3 Broden Views |
| 98309-8 | XR Knee - left AP W valgus stress |
| 98310-6 | XR Knee - left AP W varus stress |
| 98311-4 | XR Calcaneus - left Lateral |
| 98312-2 | XR Calcaneus - left Canale |
| 98313-0 | XR Foot cuneiform bones - bilateral Views |
| 98314-8 | XR Forefoot - bilateral Views |
| 98315-5 | XR Calcaneus - bilateral Lateral |
| 98316-3 | XR Knee - bilateral Single view W valgus stress |
| 98317-1 | XR Knee - bilateral AP W varus stress |
| 98318-9 | XR Ankle - bilateral Mortise W gravity stress |
| 98319-7 | XR Calcaneus - bilateral LE 3 Broden Views |
| 98320-5 | XR Toe fourth - bilateral Lateral |
| 98321-3 | XR Toe second - bilateral Lateral |
| 98322-1 | XR Toe third - bilateral Lateral |
| 98323-9 | XR Toe fifth - bilateral Lateral |
| 98324-7 | XR Sacrum and Coccyx Views AP |
| 98325-4 | XR Sacrum and Coccyx Lateral Views |
| 98326-2 | XR Thoracic and lumbar spine PA Views for scoliosis W standing |
| 98327-0 | XR Thoracic and lumbar spine AP Views for scoliosis W standing |
| 98328-8 | XR Spine thoracolumbar junction Lateral |
| 98329-6 | XR Spine thoracolumbar junction AP |
| 98330-4 | XR Sternum PA Views |
| 98331-2 | XR Sternum Oblique Views |
| 98332-0 | XR Wrist - right Reverse oblique |
| 98333-8 | XR Scaphoid and Trapezium and Trapezoid - right Single view |
| 98334-6 | XR Hamate - right Single view |
| 98335-3 | XR Pisiform and Triquetrum - right Single view |
| 98336-1 | XR Wrist - right AP |
| 98337-9 | XR Wrist - right Lateral |
| 98338-7 | XR Wrist - left Lateral |
| 98339-5 | XR Wrist - left AP |
| 98340-3 | XR Wrist - left Reverse oblique |
| 98341-1 | XR Pisiform and Triquetrum - left Single view |
| 98342-9 | XR Hamate - left Single view |
| 98343-7 | XR Scaphoid and Trapezium and Trapezoid - left Single view |
| 98344-5 | XR Wrist - bilateral AP |
| 98345-2 | XR Wrist - bilateral Lateral |
| 98346-0 | XR Scaphoid and Trapezium and Trapezoid - bilateral Views |
| 98347-8 | XR Hamate - bilateral Views |
| 98348-6 | XR Pisiform and Triquetrum - bilateral Views |
| 98349-4 | XR Wrist - bilateral Ulnar deviation Views |
| 98350-2 | XR Wrist - bilateral Radial deviation |
| 98351-0 | XR Thumb - right Radial deviation |
| 98352-8 | XR Thumb - right PA |
| 98353-6 | XR Thumb - left Oblique |
| 98354-4 | XR Thumb - left PA |
| 98355-1 | XR Thumb - bilateral PA |
| 98356-9 | XR Coccyx AP |
| 98357-7 | XR Coccyx Lateral |
| 98358-5 | XR Cervical spine Single view W flexion |
| 98359-3 | XR Cervical spine Odontoid |
| 98360-1 | XR Cervical spine Single view W extension |
| 98361-9 | XR Thumb - left Radial deviation |
| 98362-7 | XR Thumb - right Oblique |
| 98363-5 | XR Sacroiliac joint - left AP and Oblique |
| 98364-3 | XR Sacroiliac joint - right AP and Oblique |
| 98365-0 | XR Thoracic spine Single view W extension |
| 98366-8 | XR Thoracic spine Single view W flexion |
| 98897-2 | XR Pelvis and Hip - left Abduction and Internal rotation |
| 98898-0 | XR Pelvis and Hip - right Abduction and Internal rotation |
| 98899-8 | XR Wrist - right Pronated oblique |
| 98900-4 | XR Wrist - left Pronated oblique |
| 99505-0 | XR Wrist - left PA |
| 99506-8 | XR Wrist - right PA |
| 99507-6 | XR Hip - right Judet external oblique |
| 99508-4 | XR Hip - left Judet external oblique |
| 99509-2 | XR Hip - left Judet internal oblique |
| 99510-0 | XR Hip - right Judet internal oblique |
| 99511-8 | XR.slot radiography Spinal cord Views |
| 99605-8 | US.doppler Lower extremity vein - left for venous mapping |
| 99606-6 | US.doppler Lower extremity vein - right for venous mapping |
| 99607-4 | US.doppler Lower extremity vein - bilateral for venous mapping |
| 99608-2 | MRA Subclavian vessels - bilateral WO and W contrast IV |
| 99609-0 | MRA Thoracic Aorta W contrast IV |
| 99610-8 | CT Abdomen and Pelvis W contrast PO |
| 99611-6 | MRA Abdominal vessels and Pelvis vessels WO contrast |
| 99628-0 | CT Neck+Chest+Abdomen+Pelvis |
| 99629-8 | CT Neck+Chest+Abdomen+Pelvis WO contrast |
| 99630-6 | CT Neck+Chest+Abdomen+Pelvis WO and W contrast IV |
| 99631-4 | Cone beam CT Temporomandibular joint - bilateral |
| 99632-2 | Cone beam CT Temporomandibular joint WO and W contrast IV |
| 99633-0 | Cone beam CT Teeth |
| 99702-3 | MR tractography Brain |
| 99703-1 | MR perfusion Brain |
| 99704-9 | MR Brain for stroke mapping |
| 99705-6 | MR Brain for seizure mapping |
| 99826-0 | US.A-scan Eye |
| 99827-8 | US.elastography Breast |
| 86420-7 | MG |
| 98318-9 | XR Ankle - bilateral Mortise W gravity stress |

## Appendix B: Possible codes for field modality in ImagingProcedures

| System | Code | Code Name |
|---|---|---|
| SNOMED | 11429006 | CONSULTATION (PROCEDURE) |
| SNOMED | 119270007 | MANAGEMENT PROCEDURE (PROCEDURE) |
| SNOMED | 371572003 | NUCLEAR MEDICINE PROCEDURE (PROCEDURE) |
| SNOMED | 44491008 | FLUOROSCOPY (PROCEDURE) |
| SNOMED | 77477000 | COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE) |
| SNOMED | 113091000 | MAGNETIC RESONANCE IMAGING (PROCEDURE) |
| SNOMED | 36004004 | DIAGNOSTIC TOMOGRAPHY (PROCEDURE) |
| SNOMED | 16310003 | DIAGNOSTIC ULTRASONOGRAPHY (PROCEDURE) |
| SNOMED | 168537006 | PLAIN RADIOGRAPHY (PROCEDURE) |
| SNOMED | 71651007 | MAMMOGRAPHY (PROCEDURE) |
| SNOMED | 418272005 | COMPUTED TOMOGRAPHY ANGIOGRAPHY (PROCEDURE) |
| SNOMED | 82918005 | POSITRON EMISSION TOMOGRAPHY (PROCEDURE) |
| SNOMED | 252792007 | MAGNETOENCEPHALOGRAPHY (PROCEDURE) |
| SNOMED | 54550000 | ELECTROENCEPHALOGRAM (PROCEDURE) |
| SNOMED | 103708000 | DIAGNOSTIC SURGICAL PROCEDURE (PROCEDURE) |
| SNOMED | 40701008 | ECHOCARDIOGRAPHY (PROCEDURE) |
| SNOMED | 76746007 | CARDIOVASCULAR STRESS TESTING (PROCEDURE) |
| SNOMED | 201456002 | CEPHALOGRAM (PROCEDURE) |
| SNOMED | 241175004 | CHOLECYSTOGRAM (PROCEDURE) |
| SNOMED | 22891007 | RADIOGRAPHY OF TEETH (PROCEDURE) |
| SNOMED | 75014006 | PELVIMETRY (PROCEDURE) |
| SNOMED | 385731000119105 | PLAIN X-RAY OF EXCISED TISSUE SPECIMEN (PROCEDURE) |
| SNOMED | 169014003 | FLUOROSCOPY AND RADIOGRAPHY (PROCEDURE) |
| SNOMED | 241032008 | STEREOGRAPHIC RADIOGRAPHY (PROCEDURE) |
| SNOMED | 426005005 | CARDIAC COMPUTED TOMOGRAPHY FOR CALCIUM SCORING (PROCEDURE) |
| SNOMED | 312236008 | DUPLEX ULTRASOUND (QUALIFIER VALUE) |
| SNOMED | 19731001 | ULTRASOUND STUDY OF EYE (PROCEDURE) |
| SNOMED | 79966006 | ULTRASONOGRAPHY OF UTERUS (PROCEDURE) |
| SNOMED | 241449005 | ULTRASOUND SCAN OF HEAD (PROCEDURE) |
| SNOMED | 175357006 | TRANSESOPHAGEAL AORTOGRAPHY (PROCEDURE) |
| SNOMED | 446045006 | ULTRASONOGRAPHY BY TRANSRECTAL APPROACH (PROCEDURE) |
| SNOMED | 268445003 | ULTRASOUND SCAN - OBSTETRIC (PROCEDURE) |
| SNOMED | 78669009 | FLUOROSCOPY, SERIAL FILMS (PROCEDURE) |
| SNOMED | 261802008 | GAMMA CAMERA (PHYSICAL OBJECT) |
| SNOMED | 105371005 | SINGLE PHOTON EMISSION COMPUTERIZED TOMOGRAPHY (PROCEDURE) |
| SNOMED | 241305009 | RADIONUCLIDE VENOGRAM (PROCEDURE) |
| SNOMED | 252432008 | RADIONUCLIDE MYOCARDIAL PERFUSION STUDY (PROCEDURE) |
| SNOMED | 450436003 | POSITRON EMISSION TOMOGRAPHY WITH COMPUTED TOMOGRAPHY (PROCEDURE) |
| SNOMED | 22400007 | COMPUTERIZED TOMOGRAPHY, 3 DIMENSIONAL RECONSTRUCTION (PROCEDURE) |
| SNOMED | 18102001 | MAMMARY DUCTOGRAM (PROCEDURE) |
| SNOMED | 241663008 | MAGNETIC RESONANCE IMAGING OF VESSELS (PROCEDURE) |
| SNOMED | 241671007 | MAGNETIC RESONANCE SPECTROSCOPY (PROCEDURE) |
| SNOMED | 241685002 | X-RAY PHOTON ABSORPTIOMETRY (PROCEDURE) |
| SNOMED | 82066000 | BONE DENSITY STUDY, DUAL PHOTON ABSORPTIOMETRY (PROCEDURE) |
| SNOMED | 77343006 | ANGIOGRAPHY (PROCEDURE) |
| SNOMED | 33148003 | ARTHROGRAPHY (PROCEDURE) |
| SNOMED | 363687006 | ENDOSCOPIC PROCEDURE (PROCEDURE) |
| SNOMED | 76981001 | DISCOGRAM (PROCEDURE) |
| SNOMED | 28367004 | CHOLANGIOGRAM (PROCEDURE) |
| SNOMED | 56087001 | DACRYOCYSTOGRAPHY (PROCEDURE) |
| SNOMED | 418507002 | FLUOROSCOPIC LARYNGOGRAPHY (PROCEDURE) |
| SNOMED | 367401004 | MYELOGRAM (PROCEDURE) |
| SNOMED | 60654006 | DIAGNOSTIC RADIOGRAPHY OF ABDOMEN (PROCEDURE) |
| SNOMED | 168896008 | CONTRAST SIALOGRAM (PROCEDURE) |
| SNOMED | 236930001 | CATHETERIZATION OF FALLOPIAN TUBE (PROCEDURE) |
| SNOMED | 277591006 | COMPUTED TOMOGRAPHY GUIDED BIOPSY (PROCEDURE) |
| SNOMED | 241466007 | INTRAVASCULAR ULTRASOUND SCAN (PROCEDURE) |
| SNOMED | 277590007 | IMAGING GUIDED BIOPSY (PROCEDURE) |
| SNOMED | 418285008 | ANGIOPLASTY OF BLOOD VESSEL (PROCEDURE) |
| SNOMED | 118805000 | PROCEDURE ON ARTERY (PROCEDURE) |
| SNOMED | 6832004 | ATHERECTOMY (PROCEDURE) |
| SNOMED | 41976001 | CARDIAC CATHETERIZATION (PROCEDURE) |
| SNOMED | 398084009 | RAPID INFUSION CATHETER (PHYSICAL OBJECT) |
| SNOMED | 405704002 | CISTERNOGRAPHY (PROCEDURE) |
| SNOMED | 419306001 | FLUOROSCOPIC FISTULOGRAPHY (PROCEDURE) |
| SNOMED | 418074003 | MAMMOGRAPHY AND ASPIRATION (PROCEDURE) |
| SNOMED | 386811000 | FETAL PROCEDURE (PROCEDURE) |
| SNOMED | 307280005 | IMPLANTATION OF CARDIAC PACEMAKER (PROCEDURE) |
| SNOMED | 24715008 | SPLENOPORTOGRAM BY SPLENIC ARTERIOGRAPHY (PROCEDURE) |
| SNOMED | 103716009 | PLACEMENT OF STENT (PROCEDURE) |
| SNOMED | 43810009 | REMOVAL OF THROMBUS (PROCEDURE) |
| SNOMED | 81188004 | TRANSCATHETER THERAPY (PROCEDURE) |
| SNOMED | 61593002 | ULTRASONIC GUIDANCE PROCEDURE (PROCEDURE) |
| SNOMED | 243769006 | ADRENAL VEIN SAMPLING CATHETER PROCEDURE (PROCEDURE) |
| SNOMED | 401226007 | VERTEBROPLASTY (PROCEDURE) |
| SNOMED | 418876000 | FLUOROSCOPIC BRONCHOGRAPHY (PROCEDURE) |
| SNOMED | 241195005 | EPIDUROGRAM (PROCEDURE) |
| SNOMED | 83607001 | GYNECOLOGIC EXAMINATION (PROCEDURE) |
| SNOMED | 277592004 | MAGNETIC RESONANCE IMAGING GUIDED BIOPSY (PROCEDURE) |
| SNOMED | 241209000 | SINOGRAM (PROCEDURE) |
| SNOMED | 282721001 | FLUOROSCOPIC GUIDANCE (PROCEDURE) |
| SNOMED | 42687005 | LYMPHANGIOGRAM (PROCEDURE) |
| SNOMED | 4970003 | VENOGRAPHY (PROCEDURE) |
| SNOMED | 241603006 | MAGNETIC RESONANCE IMAGING OF BRAIN WITH FUNCTIONAL IMAGING (PROCEDURE) |
| SNOMED | 432877007 | MAGNETIC RESONANCE IMAGING OF PULMONARY PERFUSION (PROCEDURE) |
| SNOMED | 363680008 | RADIOGRAPHIC IMAGING PROCEDURE (PROCEDURE) |
| SNOMED | 260931002 | POST-PROCESSING (QUALIFIER VALUE) |
| SNOMED | 384719006 | PROCEDURE ON GASTROINTESTINAL TRACT (PROCEDURE) |
| SNOMED | 118674002 | PROCEDURE ON GENITOURINARY SYSTEM (PROCEDURE) |
| SNOMED | 238181003 | PROCEDURE ON SPINE (PROCEDURE) |
| SNOMED | 51308000 | THROMBOLYSIS, FUNCTION (OBSERVABLE ENTITY) |
| SNOMED | 118797008 | PROCEDURE ON HEART (PROCEDURE) |
| SNOMED | 118675001 | PROCEDURE ON FEMALE GENITAL SYSTEM (PROCEDURE) |
| SNOMED | 399163009 | MAGNIFIED PROJECTION (QUALIFIER VALUE) |
| SNOMED | 76981001 | DISCOGRAM (PROCEDURE) |
| SNOMED | 230141000000103 | UREA BREATH TEST (PROCEDURE) |
| SNOMED | 76981001 | DISCOGRAM (PROCEDURE) |
| RADLEX | RID10417 | DRAINAGE |

## Appendix C: Possible codes for field anatomy in ImagingProcedures

| System | Code | Code Name |
|---|---|---|
| SNOMED | 11429006 | CONSULTATION (PROCEDURE)SNOMED |
| SNOMED | 15497006 | OVARIAN STRUCTURE (BODY STRUCTURE) |
| SNOMED | 22083002 | STRUCTURE OF SPLENIC ARTERY (BODY STRUCTURE) |
| SNOMED | 261188006 | WHOLE BODY (QUALIFIER VALUE) |
| SNOMED | 76752008 | BREAST STRUCTURE (BODY STRUCTURE) |
| SNOMED | 80891009 | HEART STRUCTURE (BODY STRUCTURE) |
| SNOMED | 51185008 | THORACIC STRUCTURE (BODY STRUCTURE) |
| SNOMED | 66019005 | LIMB STRUCTURE (BODY STRUCTURE) |
| SNOMED | 421060004 | STRUCTURE OF VERTEBRAL COLUMN (BODY STRUCTURE) |
| SNOMED | 77142006 | EXTERNAL GENITALIA STRUCTURE (BODY STRUCTURE) |
| SNOMED | 69536005 | HEAD STRUCTURE (BODY STRUCTURE) |
| SNOMED | 45048000 | NECK STRUCTURE (BODY STRUCTURE) |
| SNOMED | 181220002 | ENTIRE ORAL CAVITY (BODY STRUCTURE) |
| SNOMED | 113345001 | ABDOMINAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 12921003 | PELVIC STRUCTURE (BODY STRUCTURE) |
| SNOMED | 699600004 | STRUCTURE OF RETROPERITONEAL SPACE (BODY STRUCTURE) |
| SNOMED | 34402009 | RECTUM STRUCTURE (BODY STRUCTURE) |
| SNOMED | 71854001 | COLON STRUCTURE (BODY STRUCTURE) |
| SNOMED | 122489005 | URINARY SYSTEM STRUCTURE (BODY STRUCTURE) |
| SNOMED | 62834003 | UPPER GASTROINTESTINAL TRACT STRUCTURE (BODY STRUCTURE) |
| SNOMED | 30315005 | SMALL INTESTINAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 89837001 | URINARY BLADDER STRUCTURE (BODY STRUCTURE) |
| SNOMED | 272673000 | BONE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 59609004 | THORACIC ESOPHAGUS STRUCTURE (BODY STRUCTURE) |
| SNOMED | 39607008 | LUNG STRUCTURE (BODY STRUCTURE) |
| SNOMED | 78904004 | CHEST WALL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 3120008 | PLEURAL MEMBRANE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 361380005 | ENTIRE RESPIRATORY AIRWAY (BODY STRUCTURE) |
| SNOMED | 955009 | BRONCHIAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 47109002 | STRUCTURE OF LYMPH NODE OF THORAX (BODY STRUCTURE) |
| SNOMED | 113197003 | BONE STRUCTURE OF RIB (BODY STRUCTURE) |
| SNOMED | 48345005 | SUPERIOR VENA CAVA STRUCTURE (BODY STRUCTURE) |
| SNOMED | 118633002 | ARTERY OF THORAX (BODY STRUCTURE) |
| SNOMED | 53120007 | UPPER LIMB STRUCTURE (BODY STRUCTURE) |
| SNOMED | 61685007 | LOWER LIMB STRUCTURE (BODY STRUCTURE) |
| SNOMED | 29092000 | VENOUS STRUCTURE (BODY STRUCTURE) |
| SNOMED | 59820001 | BLOOD VESSEL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 4150005 | CELIAC NERVOUS PLEXUS STRUCTURE (BODY STRUCTURE) |
| SNOMED | 122495006 | THORACIC SPINE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 122494005 | CERVICAL SPINE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 39723000 | SACROILIAC JOINT STRUCTURE (BODY STRUCTURE) |
| SNOMED | 122496007 | LUMBAR SPINE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 64688005 | BONE STRUCTURE OF COCCYX (BODY STRUCTURE) |
| SNOMED | 303950008 | SACRAL SPINE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 38781007 | STRUCTURE OF APPENDICULAR SKELETON (BODY STRUCTURE) |
| SNOMED | 302509004 | ENTIRE HEART (BODY STRUCTURE) |
| SNOMED | 41801008 | CORONARY ARTERY STRUCTURE (BODY STRUCTURE) |
| SNOMED | 38199008 | TOOTH STRUCTURE (BODY STRUCTURE) |
| SNOMED | 53620006 | TEMPOROMANDIBULAR JOINT STRUCTURE (BODY STRUCTURE) |
| SNOMED | 714483002 | STRUCTURE OF ORBITAL REGION (BODY STRUCTURE) |
| SNOMED | 314301005 | STRUCTURE OF ARTERY OF EYE AND ORBIT (BODY STRUCTURE) |
| SNOMED | 12738006 | BRAIN STRUCTURE (BODY STRUCTURE) |
| SNOMED | 272679001 | BONE STRUCTURE OF HEAD (BODY STRUCTURE) |
| SNOMED | 281138005 | INTRACRANIAL VASCULAR STRUCTURE (BODY STRUCTURE) |
| SNOMED | 59066005 | MASTOID STRUCTURE (BODY STRUCTURE) |
| SNOMED | 62505001 | INTERNAL AUDITORY CANAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 117590005 | EAR STRUCTURE (BODY STRUCTURE) |
| SNOMED | 15753006 | NASOLACRIMAL DUCT STRUCTURE (BODY STRUCTURE) |
| SNOMED | 35763008 | STRUCTURE OF POSTERIOR FOSSA OF CRANIAL CAVITY (BODY STRUCTURE) |
| SNOMED | 385294005 | SALIVARY GLAND STRUCTURE (BODY STRUCTURE) |
| SNOMED | 54066008 | PHARYNGEAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 281231009 | VASCULAR STRUCTURE OF HEAD (BODY STRUCTURE) |
| SNOMED | 119568004 | STRUCTURE OF ARTERY OF NECK (BODY STRUCTURE) |
| SNOMED | 69748006 | THYROID STRUCTURE (BODY STRUCTURE) |
| SNOMED | 111002 | PARATHYROID STRUCTURE (BODY STRUCTURE) |
| SNOMED | 60075002 | CERVICAL ESOPHAGUS STRUCTURE (BODY STRUCTURE) |
| SNOMED | 4596009 | LARYNGEAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 81105003 | CERVICAL LYMPH NODE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 91397008 | BONE STRUCTURE OF FACE (BODY STRUCTURE) |
| SNOMED | 89545001 | FACE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 74386004 | NASAL BONE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 2095001 | NASAL SINUS STRUCTURE (BODY STRUCTURE) |
| SNOMED | 392081006 | BONE STRUCTURE OF JAW (BODY STRUCTURE) |
| SNOMED | 10200004 | LIVER STRUCTURE (BODY STRUCTURE) |
| SNOMED | 86763002 | PORTAL VENOUS SYSTEM STRUCTURE (BODY STRUCTURE) |
| SNOMED | 15776009 | PANCREATIC STRUCTURE (BODY STRUCTURE) |
| SNOMED | 64033007 | KIDNEY STRUCTURE (BODY STRUCTURE) |
| SNOMED | 23451007 | ADRENAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 34707002 | BILIARY TRACT STRUCTURE (BODY STRUCTURE) |
| SNOMED | 78961009 | SPLENIC STRUCTURE (BODY STRUCTURE) |
| SNOMED | 69695003 | STOMACH STRUCTURE (BODY STRUCTURE) |
| SNOMED | 28273000 | BILE DUCT STRUCTURE (BODY STRUCTURE) |
| SNOMED | 28231008 | GALLBLADDER STRUCTURE (BODY STRUCTURE) |
| SNOMED | 15425007 | PERITONEUM (SEROUS MEMBRANE) STRUCTURE (BODY STRUCTURE) |
| SNOMED | 64131007 | INFERIOR VENA CAVA STRUCTURE (BODY STRUCTURE) |
| SNOMED | 281471001 | STRUCTURE OF ABDOMINAL BLOOD VESSEL (BODY STRUCTURE) |
| SNOMED | 41216001 | PROSTATIC STRUCTURE (BODY STRUCTURE) |
| SNOMED | 54268001 | PELVIC LYMPH NODE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 54735007 | BONE STRUCTURE OF SACRUM (BODY STRUCTURE) |
| SNOMED | 90264002 | MALE GENITAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 281496003 | STRUCTURE OF PELVIC BLOOD VESSEL (BODY STRUCTURE) |
| SNOMED | 31435000 | FALLOPIAN TUBE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 53065001 | FEMALE GENITAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 35039007 | UTERINE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 76784001 | VAGINAL STRUCTURE (BODY STRUCTURE) |
| SNOMED | 75531005 | STRUCTURE OF ARTERY OF UPPER EXTREMITY (BODY STRUCTURE) |
| SNOMED | 127949000 | ELBOW REGION STRUCTURE (BODY STRUCTURE) |
| SNOMED | 14975008 | FOREARM STRUCTURE (BODY STRUCTURE) |
| SNOMED | 40983000 | UPPER ARM STRUCTURE (BODY STRUCTURE) |
| SNOMED | 125685002 | DIGIT OF HAND STRUCTURE (BODY STRUCTURE) |
| SNOMED | 85562004 | HAND STRUCTURE (BODY STRUCTURE) |
| SNOMED | 8205005 | WRIST REGION STRUCTURE (BODY STRUCTURE) |
| SNOMED | 361103004 | ENTIRE SHOULDER REGION (BODY STRUCTURE) |
| SNOMED | 1893007 | JOINT STRUCTURE OF SHOULDER GIRDLE OR UPPER LIMB (BODY STRUCTURE) |
| SNOMED | 56459004 | FOOT STRUCTURE (BODY STRUCTURE) |
| SNOMED | 29836001 | HIP REGION STRUCTURE (BODY STRUCTURE) |
| SNOMED | 344001 | ANKLE REGION STRUCTURE (BODY STRUCTURE) |
| SNOMED | 281238003 | VASCULAR STRUCTURE OF LOWER LIMB (BODY STRUCTURE) |
| SNOMED | 30021000 | LOWER LEG STRUCTURE (BODY STRUCTURE) |
| SNOMED | 83555006 | STRUCTURE OF LYMPHATIC VESSEL (BODY STRUCTURE) |
| SNOMED | 72696002 | KNEE REGION STRUCTURE (BODY STRUCTURE) |
| SNOMED | 68367000 | THIGH STRUCTURE (BODY STRUCTURE) |
| SNOMED | 4527007 | JOINT STRUCTURE OF LOWER EXTREMITY (BODY STRUCTURE) |
| SNOMED | 7832008 | ABDOMINAL AORTA STRUCTURE (BODY STRUCTURE) |
| SNOMED | 244261004 | ABDOMINAL VISCERAL ARTERY (BODY STRUCTURE) |
| SNOMED | 116373007 | STRUCTURE OF ARTERY OF PELVIC REGION (BODY STRUCTURE) |
| SNOMED | 244239009 | ENTIRE INTERNAL THORACIC ARTERY (BODY STRUCTURE) |
| SNOMED | 113262008 | THORACIC AORTA STRUCTURE (BODY STRUCTURE) |
| SNOMED | 81040000 | PULMONARY ARTERY STRUCTURE (BODY STRUCTURE) |
| SNOMED | 976004 | STRUCTURE OF OVARIAN VEIN (BODY STRUCTURE) |
| SNOMED | 244389004 | ENTIRE SYSTEMIC VEIN (BODY STRUCTURE) |
| SNOMED | 281157001 | SYSTEMIC VASCULAR STRUCTURE (BODY STRUCTURE) |
| SNOMED | 18911002 | PENILE STRUCTURE (BODY STRUCTURE) |
| SNOMED | 40689003 | TESTIS STRUCTURE (BODY STRUCTURE) |
| SNOMED | 17137000 | STRUCTURE OF BRACHIAL ARTERY (BODY STRUCTURE) |
| SNOMED | 244324006 | ENTIRE ARTERY OF LOWER EXTREMITY (BODY STRUCTURE) |
| SNOMED | 70791007 | STRUCTURE OF ARTERY OF LOWER EXTREMITY (BODY STRUCTURE) |
| SNOMED | 69105007 | CAROTID ARTERY STRUCTURE (BODY STRUCTURE) |
| SNOMED | 85234005 | STRUCTURE OF VERTEBRAL ARTERY (BODY STRUCTURE) |
| SNOMED | 22286001 | EXTERNAL CAROTID ARTERY STRUCTURE (BODY STRUCTURE) |
| SNOMED | 56400007 | STRUCTURE OF RENAL VEIN (BODY STRUCTURE) |
| SNOMED | 303410000 | VASCULAR STRUCTURE OF LIVER (BODY STRUCTURE) |
| SNOMED | 303413003 | VASCULAR STRUCTURE OF ADRENAL GLAND (BODY STRUCTURE) |
| SNOMED | 279495008 | HUMAN BODY STRUCTURE (BODY STRUCTURE) |
| SNOMED | 361355005 | ENTIRE HEAD AND NECK (BODY STRUCTURE) |
| SNOMED | 732168005 | ENTIRE ABDOMEN AND PELVIS (BODY STRUCTURE) |
| SNOMED | 304062003 | INTRATHORACIC VASCULAR STRUCTURE (BODY STRUCTURE) |
| SNOMED | 727430004 | ENTIRE ARTERY OF THORAX (BODY STRUCTURE) |
| SNOMED | 281237008 | VASCULAR STRUCTURE OF UPPER LIMB (BODY STRUCTURE) |
| SNOMED | 244310007 | ENTIRE ARTERY OF UPPER EXTREMITY (BODY STRUCTURE) |
| SNOMED | 731109002 | ENTIRE ARTERY OF NECK (BODY STRUCTURE) |
| SNOMED | 304063008 | STRUCTURE OF ABDOMINAL AND/OR PELVIC BLOOD VESSEL (BODY STRUCTURE) |
| SNOMED | 304062003 | INTRATHORACIC VASCULAR STRUCTURE (BODY STRUCTURE) |
| RADLEX | RID50393 | SET OF ABDOMINAL ARTERIES |
| RADLEX | RID49536 | SET OF INTERCOSTAL ARTERIES |

## Appendix D: Possible radlex codes for field view type in ImagingProcedures

| Code | Code Name |
|---|---|
| RIDY44 | SKI JUMP VIEW (NUANCE) |
| RID50646 | PRONATED OBLIQUE VIEW |
| RID50640 | OCCLUSAL VIEW |
| RID50644 | REVERSE OBLIQUE VIEW |
| RID50643 | CANALE VIEW |
| RID50641 | BERNAGEAU VIEW |
| RID50645 | ABDUCTION VIEW |
| RID45659 | BABYGRAM |
| RID6427 | TRANSABDOMINAL |
| RID39543 | TRANSVAGINAL |
| RID39542 | TRANSRECTAL |
| RID49830 | PANORAMIC |
| RID5818 | ANTERIOR |
| RID28651 | MAGNIFICATION |
| RID10455 | UPRIGHT POSITION |
| RID10451 | OPEN MOUTH POSITION |
| RID50172 | CLOSED MOUTH POSITION |
| RID10447 | ULNAR DEVIATION POSITION |
| RID10446 | RADIAL DEVIATION POSITION |
| RID10424 | RIGHT LATERAL DECUBITUS POSITION |
| RID10425 | LEFT LATERAL DECUBITUS POSITION |
| RID10439 | LATERAL DECUBITUS POSITION |
| RID43584 | APICAL LORDOTIC VIEW |
| RID43583 | AP VIEW |
| RID43594 | PA VIEW |
| RID43586 | CONE VIEW |
| RID43597 | SPOT VIEW |
| RID43591 | LATERAL VIEW |
| RID43689 | OCCIPITOMENTAL VIEW |
| RID45783 | CARPAL TUNNEL VIEW |
| RID45785 | TRANSTHORACIC VIEW |
| RID45789 | OUTLET VIEW |
| RID45788 | INLET VIEW |
| RID45787 | TUNNEL VIEW |
| RID45795 | OBLIQUES VIEW |
| RID45790 | AXILLARY VIEW |
| RID45791 | SUBMENTOVERTICAL VIEW |
| RID45779 | SUPINE VIEW |
| RID50373 | TRANS-SCAPULAR VIEW |
| RID45661 | OBLIQUE VIEW |
| RID45663 | SWIMMERS VIEW |
| RID50094 | 90 DEGREE ABDUCTION VIEW |
| RID50079 | INTERNAL ROTATION VIEW |
| RID50077 | EXTERNAL ROTATION VIEW |
| RID50119 | RADIO HEAD CAPITALLAR VIEW |
| RID50118 | POSTEROANTERIOR PRONE VIEW |
| RID50116 | ODONTOID VIEW |
| RID50115 | MORTISE VIEW |
| RID50129 | Y VIEW |
| RID50123 | SERENDIPITY VIEW |
| RID50124 | TANGENTIAL VIEW |
| RID50128 | LATERALLY EXAGGERATED CRANIOCAUDAL VIEW |
| RID50125 | TRUE ANTEROPOSTERIOR VIEW |
| RID50126 | TRUE LATERAL VIEW |
| RID50122 | SCAPHOID VIEW |
| RID50105 | ENDOVAGINAL VIEW |
| RID50104 | ENDORECTAL VIEW |
| RID50628 | MAXIMUM ABDUCTION |
| RID50534 | BITEWING VIEW |
| RID50098 | AXIAL VIEW OF CALCANEUS |
| RID10534 | RADIOGRAPHY GRID |
| RID45802 | RUNOFF |
| RID10521 | FRONTAL PROJECTION |
| RID50629 | OBLIQUE PRONE |
| RID45786 | SUNRISE VIEW |
| RID50370 | MERCHANT 30 DEGREES VIEW |
| RID50372 | MERCHANT 60 DEGREES VIEW |
| RID50371 | MERCHANT 45 DEGREES VIEW |
| RID50093 | 45 DEGREE CEPHALIC ANGLE VIEW |
| RID50091 | 20 DEGREE CEPHALIC ANGLE VIEW |
| RID50090 | 10 DEGREE CEPHALIC ANGLE VIEW |
| RID50088 | 30 DEGREE CAUDAL ANGLE VIEW |
| RID50087 | 10 DEGREE CAUDAL ANGLE VIEW |
| RID43593 | LEFT OBLIQUE VIEW |
| RID43596 | RIGHT OBLIQUE VIEW |
| RID50386 | OBLIQUE UPRIGHT VIEW |
| RID50114 | MEDIOLATERAL OBLIQUE VIEW |
| RID50635 | OBLIQUE CROSSTABLE |
| RID43686 | TOWNE VIEW |
| RID43681 | STENVERS VIEW |
| RID43682 | STRYKER NOTCH VIEW |
| RID43690 | WEST POINT VIEW |
| RID43665 | NORGAARD VIEW |
| RID43667 | ORIGINAL LAW VIEW |
| RID43671 | CALDWELL VIEW |
| RID43654 | MERCHANT VIEW |
| RID43653 | MAYER VIEW |
| RID43621 | FRIEDMAN VIEW |
| RID43625 | GRASHEY VIEW |
| RID43637 | JUDET VIEW |
| RID43630 | HOLMBLAD VIEW |
| RID43605 | BRODEN VIEW |
| RID43618 | FERGUSON VIEW |
| RID43616 | DANELIUS MILLER VIEW |
| RID50097 | GARTH VIEW |
| RID50095 | BORA VIEW |
| RID50096 | BREWERTON VIEW |
| RID50099 | ROSENBERG VIEW |
| RID50111 | LAURIN VIEW |
| RID50127 | VELPEAU VIEW |
| RID50102 | WATERS UPRIGHT VIEW |
| RID50100 | VON ROSEN VIEW |
| RID50103 | ZANCA VIEW |
| RID43600 | ARCELIN VIEW |
| RID50535 | JONES VIEW |
| RID45780 | LEFT LATERAL VIEW |
| RID45781 | RIGHT LATERAL VIEW |
| RID45782 | CROSS TABLE LATERAL VIEW |
| RID50107 | LATERAL FROG LEG VIEW |
| RID50109 | LATERAL SPOT VIEW |
| RID50092 | POSTEROANTERIOR 30 DEGREE FLEXION VIEW |
| RID50070 | POSTEROANTERIOR 45-DEGREE FLEXION VIEW |
| RID10509 | IMPLANT DISPLACED |
| RID50329 | ROLLED BREAST VIEW |
| RID50328 | AIR GAP BREAST VIEW |
| RID50120 | RIGHT ANTERIOR OBLIQUE VIEW |
| RID50121 | RIGHT POSTERIOR OBLIQUE VIEW |
| RID50113 | LEFT POSTERIOR OBLIQUE VIEW |
| RID50106 | LEFT ANTERIOR OBLIQUE VIEW |
| RID50367 | SUNRISE 20 DEGREES VIEW |
| RID50369 | SUNRISE 60 DEGREES VIEW |
| RID50368 | SUNRISE 40 DEGREES VIEW |
| RID10579 | AXIAL PLANE |
| RID31596 | EXTERNAL OBLIQUE |
| RID31599 | INTERNAL OBLIQUE |



