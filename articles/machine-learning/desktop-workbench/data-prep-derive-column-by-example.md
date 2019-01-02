---
title: Derive Column by Example transformation using Azure Machine Learning Workbench
description: The reference document for the 'Derive Column by Example' transform
services: machine-learning
author: ranvijaykumar
ms.author: ranku
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc, reference
ms.topic: article
ms.date: 09/14/2017

ROBOTS: NOINDEX
---


# Derive column by example transformation

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



The **Derive Column by Example** transform enables users to create a derivative of one or more existing columns using user provided examples of the derived result. The derivative can be any combination of the supported String, Date, and Number transformations. 

Following String, Date, and Number transformations are supported:

**String transformations:** 

Substring including intelligent extraction of Number and Dates, Concatenation, Case Manipulation, Mapping Constant Values.

**Date transformations:** 

Date Format change, Extracting Date Parts, Mapping Time to Time Bins.

The date transformations are fairly generic with a few notable limitations:
* Timezones are unsupported.
* Some common formats that are unsupported:
    * ISO 8601 week of year format (for example “2009-W53-7”) 
    * Unix epoch time.
* All formats are case-sensitive (notably “4am” is not recognized as a time although “4AM” is).

**Number transformations:** 

Round, Floor, Ceiling, Binning, Padding with zeros or space, Division or Multiplication by a power of 1000.

**Composite transformations:** 

Any combination of String, Number, or Date Transformations.

## How to use this transformation

To perform this transform, follow these steps:
1. Select one or more columns that you want to derive the value from. 
2. Select **Derive Column by Example** from the **Transforms** menu. Or, Right click on the header of any of the selected columns and select **Derive Column by Example** from the context menu. The Transform Editor opens and a new column is added next to the right most selected column. Selected columns can be identified by the checkboxes in the column headers. Addition and removal of columns from the selection can be done by using the checkboxes in the column headers.
3. Type an example of the *output* against a row, and press enter. At this point, the Workbench analyzes the input column as well as the provided output to synthesize a program that can transform the given inputs into output. The synthesized program is executed against all the rows in the data grid. For ambiguous and complicated cases, multiple examples may be needed. Depending on whether you are in Basic Mode or Advanced Mode, multiple examples can be provided in different ways.
4. Review the output and Click **OK** to accept the transform.

### Transform editor: basic mode

Basic Mode provides an inline editing experience in the data grid. You can provide examples of the output by navigating to the cell of interest and typing the value. 

The workbench analyses the data and tries to identify the edge cases that should be reviewed by the user. While the data is being analyzed, **Analyzing Data** is shown in the header of the Transform Editor. One the analysis is complete, either **No Suggestions** or, **Review next suggested row** is displayed in the header. You can navigate through the edge cases by clicking on **Review next suggested row**. In case the value is incorrect for a row, you should key in the correct value as additional example. 

### Transform editor: advanced mode

Advanced Mode provides a richer experience for Deriving columns by example. All the examples are shown at one place. You can also review all the edge cases at one place by clicking on **Show suggested examples**. 

In the advanced mode, you can add any row as an example row by double-clicking on the row in the grid. One a row is copied as an example row, you can also edit the data in the source columns to make a synthetic example. By doing so, you can add cases that are not currently present in the sample data.

User can switch between the **Basic Mode** and the **Advanced Mode** by clicking the links in the Transform Editor.

### Transform editor: Send Feedback

Clicking on the **Send feedback** link opens the **Feedback** dialog with the comments box prepopulated with the examples user has provided. User should review the content of the comments box and provide more details to help us understand the issue. If the user does not want to share data with Microsoft, user should delete the prepopulated example data before clicking the **Send Feedback** button. 

### Editing existing transformation

A user can edit an existing **Derive Column By Example** transform by selecting **Edit** option of the Transformation Step. Clicking on **Edit** opens the Transform Editor in **Advanced Mode**, and all the examples that were provided during creation of the transform are shown.

## Examples of string transformations by example


>[!NOTE] 
>Values in **bold** represent the examples that were provided in order to complete the transformation in the shown dataset.


### S1. Extracting file names from file paths

Number of Examples that were required for this case: 2

|Input|Output|
|:-----|:-----|
|C:\Python35\Tools\pynche\TypeinViewer.py|**TypeinViewer.py**|
|C:\Python35\Tools\pynche\webcolors.txt|webcolors.txt|
|C:\Python35\Tools\pynche\websafe.txt|websafe.txt|
|C:\Python35\Tools\pynche\X\rgb.txt|rgb.txt|
|C:\Python35\Tools\pynche\X\xlicense.txt|xlicense.txt|
|C:\Python35\Tools\Scripts\2to3.py|2to3.py|
|C:\Python35\Tools\Scripts\analyze_dxp.py|**analyze_dxp.py**|
|C:\Python35\Tools\Scripts\byext.py|byext.py|
|C:\Python35\Tools\Scripts\byteyears.py|byteyears.py|
|C:\Python35\Tools\Scripts\checkappend.py|checkappend.py|

### S2. Case manipulation during string extraction

Number of Examples that were required for this case: 3

|Input|Output|
|:-----|:-----|
|REINDEER CT & DEAD END;  NEW HANOVER; Station 332; 2015-12-10 \@ 17:10:52;|**New Hanover**|
|BRIAR PATH & WHITEMARSH LN;  HATFIELD TOWNSHIP; Station 345; 2015-12-10 \@ 17:29:21;|Hatfield Township|
|HAWS AVE; NORRISTOWN; 2015-12-10 \@ 14:39:21-Station:STA27;|**Norristown**|
|AIRY ST & SWEDE ST;  NORRISTOWN; Station 308A; 2015-12-10 \@ 16:47:36;|**Norristown**|
|CHERRYWOOD CT & DEAD END;  LOWER POTTSGROVE; Station 329; 2015-12-10 \@ 16:56:52;|Lower Pottsgrove|
|CANNON AVE & W 9TH ST;  LANSDALE; Station 345; 2015-12-10 \@ 15:39:04;|Lansdale|
|LAUREL AVE & OAKDALE AVE;  HORSHAM; Station 352; 2015-12-10 \@ 16:46:48;|Horsham|
|COLLEGEVILLE RD & LYWISKI RD;  SKIPPACK; Station 336; 2015-12-10 \@ 16:17:05;|Skippack|
|MAIN ST & OLD SUMNEYTOWN PIKE;  LOWER SALFORD; Station 344; 2015-12-10 \@ 16:51:42;|Lower Salford|
|BLUEROUTE  & RAMP I476 NB TO CHEMICAL RD; PLYMOUTH; 2015-12-10 \@ 17:35:41;|Plymouth|
|RT202 PKWY & KNAPP RD; MONTGOMERY; 2015-12-10 \@ 17:33:50;|Montgomery|
|BROOK RD & COLWELL LN; PLYMOUTH; 2015-12-10 \@ 16:32:10;|Plymouth|

### S3. Date-format manipulation during string extraction

Number of Examples that were required for this case: 1

|Input|Output|
|:-----|:-----|
|MONTGOMERY AVE & WOODSIDE RD;  LOWER MERION; Station 313; 2015-12-11 \@ 04:11:35;|**12 Nov 2015 4AM**|
|DREYCOTT LN & W LANCASTER AVE;  LOWER MERION; Station 313; 2015-12-11 \@ 01:29:52;|12 Nov 2015 1AM|
|E LEVERING MILL RD & CONSHOHOCKEN STATE RD; LOWER MERION; 2015-12-11 \@ 07:29:58;|12 Nov 2015 7AM|
|PENN VALLEY RD & MANOR RD;  LOWER MERION; Station 313; 2015-12-10 \@ 20:53:30;|12 Oct 2015 8PM|
|BELMONT AVE & OVERHILL RD; LOWER MERION; 2015-12-10 \@ 23:02:27;|12 Oct 2015 11PM|
|W MONTGOMERY AVE & PENNSWOOD RD; LOWER MERION; 2015-12-10 \@ 19:25:22;|12 Oct 2015 7PM|
|ROSEMONT AVE & DEAD END;  LOWER MERION; Station 313; 2015-12-10 \@ 18:43:07;|12 Oct 2015 6PM|
|AVIGNON DR & DEAD END; LOWER MERION; 2015-12-10 \@ 20:01:29-Station:STA24;|12 Oct 2015 8PM|

### S4. Concatenating strings

Number of Examples that were required for this case: 1

>[!NOTE] 
>In this example, special character · represents spaces in the Output column.

|First Name|Middle Initial|Last Name|Output|
|:-----|:-----|:-----|:-----|
|Laquanda||Lohmann|Laquanda··Lohmann|
|Claudio|A|Chew|**Claudio·A·Chew**|
|Sarah-Jane|S|Smith|Sarah-Jane·S·Smith|
|Brandi||Blumenthal|Brandi··Blumenthal|
|Jesusita|R|Journey|Jesusita·R·Journey|
|Hermina||Hults|Hermina··Hults|
|Anne-Marie|W|Jones|Anne-Marie·W·Jones|
|Rico||Ropp|Rico··Ropp|
|Lauren-May||Fullmer|Lauren-May··Fullmer|
|Marc|T|Maine|Marc·T·Maine|
|Angie||Adelman|Angie··Adelman|
|John-Paul||Smith|John-Paul··Smith|
|Song|W|Staller|Song·W·Staller|
|Jill||Jefferies|Jill··Jefferies|
|Ruby-Grace|M|Simmons|Ruby-Grace·M·Simmons|

### S5. Generating initials

Number of Examples that were required for this case: 2

|Full Name|Output|
|:-----|:-----|
|Laquanda Lohmann|**L.L.**|
|Claudio Chew|C.C.|
|Sarah-Jane Smith|S.S.|
|Brandi Blumenthal|B.B.|
|Jesusita Journey|J.J.|
|Hermina Hults|H.H.|
|Anne-Marie Jones|A.J.|
|Rico Ropp|R.R.|
|Lauren-May Fullmer|L.F.|
|Marc Maine|M.M.|
|Angie Adelman|A.A.|
|John-Paul Smith|**J.S.**|
|Song Staller|S.S.|
|Jill Jefferies|J.J.|
|Ruby-Grace Simmons|R.S.|


### S6. Mapping constant values

Number of Examples that were required for this case: 3

|Administrative Gender|Output|
|:-----|:-----:|
|Male|**0**|
|Female|**1**|
|Unknown|**2**|
|Female|1|
|Female|1|
|Male|0|
|Unknown|2|
|Male|0|
|Female|1|

## Examples of number transformations by example

>[!NOTE] 
>Values in **bold** represent the examples that were provided in order to complete the transformation in the shown dataset.


### N1. Rounding to nearest 10

Number of Examples that were required for this case: 1

|Input|Output|
|-----:|-----:|
|112|**110**|
|117|120|
|11112|11110|
|11119|11120|
|548|550|

### N2. Rounding down to nearest 10

Number of Examples that were required for this case: 2

|Input|Output|
|-----:|-----:|
|112|**110**|
|117|**110**|
|11112|11110|
|11119|11110|
|548|540|

### N3. Rounding to nearest 0.05

Number of Examples that were required for this case: 2

|Input|Output|
|-----:|-----:|
|-75.5812935|**-75.60**|
|-75.2646799|-75.25|
|-75.3519752|-75.35|
|-75.343513|**-75.35**|
|-75.6033497|-75.60|
|-75.283245|-75.30|

### N4. Binning

Number of Examples that were required for this case: 1

|Input|Output|
|-----:|:-----:|
|20.16|**20-25**|
|14.32|10-15|
|5.44|5-10|
|3.84|0-5|
|3.73|0-5|
|7.36|5-10|

### N5. Scaling by 1000

Number of Examples that were required for this case: 1

|Input|Output|
|-----:|-----:|
|-243|**-243000**|
|-12.5|-12500|
|-2345.23292|-2345232.92|
|-1202.3433|-1202343.3|
|1202.3433|1202343.3|

### N6. Padding

Number of Examples that were required for this case: 1

|Code|Output|
|-----:|-----:|
|5828|**05828**|
|44130|44130|
|49007|49007|
|29682|29682|
|4759|04759|
|10029|10029|
|7204|07204|

## Examples of date transformations by example

>[!NOTE] 
>Values in **bold** represent the examples that were provided in order to complete the transformation in the shown dataset.


### D1. Extracting date parts

These Date parts were extracted using different by-example transformations on the same data set. Bold strings represent the examples that were given in their respective transformation.

|DateTime|Weekday|Date|Month|Year|Hour|Minute|Second|
|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
|31-Jan-2031 05:54:18|**Fri**|**31**|**Jan**|**2031**|**5**|**54**|**18**|
|17-Jan-1990 13:32:01|Wed|17|Jan|1990|13|32|01|
|14-Feb-2034 05:36:07|Tue|14|Feb|2034|5|36|07|
|14-Mar-2002 13:16:16|Thu|14|Mar|2002|13|16|16|
|21-Jan-1985 05:44:43|Mon|21|Jan|1985|5|44|**43**|
|16-Aug-1985 01:11:56|Fri|16|Aug|1985|1|11|56|
|20-Dec-2033 18:36:29|Tue|20|Dec|2033|18|36|29|
|16-Jul-1984 10:21:59|Mon|16|Jul|1984|10|21|59|
|13-Jan-2038 10:59:36|Wed|13|Jan|2038|10|59|36|
|14-Aug-1982 15:13:54|Sat|14|Aug|1982|15|13|54|
|22-Nov-2030 08:18:08|Fri|22|Nov|2030|8|18|08|
|21-Oct-1997 08:42:58|Tue|21|Oct|1997|8|42|58|
|28-Nov-2006 14:19:15|Tue|28|Nov|2006|14|19|15|
|29-Apr-2031 04:59:45|Tue|29|Apr|2031|4|59|45|
|29-Jan-2032 02:38:36|Thu|29|Jan|2032|2|38|36|
|11-May-2028 15:31:52|Thu|11|May|2028|15|31|52|
|15-Jul-1977 12:45:39|Fri|15|Jul|1977|12|45|39|
|27-Jan-2029 05:55:41|Sat|27|Jan|2029|5|55|41|
|03-Mar-2024 10:17:49|Sun|3|Mar|2024|10|17|49|
|14-Apr-2010 00:23:13|Wed|14|Apr|2010|0|23|13|

### D2. Formatting dates

These Date formattings were done using different by-example transformations on the same data set. Bold strings represent the examples that were given in their respective transformation.

|DateTime|Format1|Format2|Format3|Format4|Format5|
|-----:|-----:|-----:|-----:|-----:|-----:|
|31-Jan-2031 05:54:18|**1/31/2031**|**Friday, January 31, 2031**|**01312031 5:54**|**31/1/2031 5:54 AM**|**Q1 2031**|
|17-Jan-1990 13:32:01|1/17/1990|Wednesday, January 17, 1990|01171990 13:32|17/1/1990 1:32 PM|Q1 1990|
|14-Feb-2034 05:36:07|2/14/2034|Tuesday, February 14, 2034|02142034 5:36|14/2/2034 5:36 AM|Q1 2034
|14-Mar-2002 13:16:16|3/14/2002|Thursday, March 14, 2002|03142002 13:16|14/3/2002 1:16 PM|Q1 2002
|21-Jan-1985 05:44:43|1/21/1985|Monday, January 21, 1985|01211985 5:44|21/1/1985 5:44 AM|Q1 1985
|16-Aug-1985 01:11:56|8/16/1985|Friday, August 16, 1985|08161985 1:11|16/8/1985 1:11 AM|Q3 1985
|20-Dec-2033 18:36:29|12/20/2033|Tuesday, December 20, 2033|12202033 18:36|20/12/2033 6:36 PM|Q4 2033
|16-Jul-1984 10:21:59|7/16/1984|Monday, July 16, 1984|07161984 10:21|16/7/1984 10:21 AM|Q3 1984
|13-Jan-2038 10:59:36|1/13/2038|Wednesday, January 13, 2038|01132038 10:59|13/1/2038 10:59 AM|Q1 2038
|14-Aug-1982 15:13:54|8/14/1982|Saturday, August 14, 1982|08141982 15:13|14/8/1982 3:13 PM|Q3 1982
|22-Nov-2030 08:18:08|11/22/2030|Friday, November 22, 2030|11222030 8:18|22/11/2030 8:18 AM|Q4 2030
|21-Oct-1997 08:42:58|10/21/1997|Tuesday, October 21, 1997|10211997 8:42|21/10/1997 8:42 AM|Q4 1997
|28-Nov-2006 14:19:15|11/28/2006|Tuesday, November 28, 2006|11282006 14:19|28/11/2006 2:19 PM|Q4 2006
|29-Apr-2031 04:59:45|4/29/2031|Tuesday, April 29, 2031|04292031 4:59|29/4/2031 4:59 AM|Q2 2031
|29-Jan-2032 02:38:36|1/29/2032|Thursday, January 29, 2032|01292032 2:38|29/1/2032 2:38 AM|Q1 2032
|11-May-2028 15:31:52|5/11/2028|Thursday, May 11, 2028|05112028 15:31|11/5/2028 3:31 PM|Q2 2028
|15-Jul-1977 12:45:39|7/15/1977|Friday, July 15, 1977|07151977 12:45|15/7/1977 12:45 PM|Q3 1977
|27-Jan-2029 05:55:41|1/27/2029|Saturday, January 27, 2029|01272029 5:55|27/1/2029 5:55 AM|Q1 2029
|03-Mar-2024 10:17:49|3/3/2024|Sunday, March 3, 2024|03032024 10:17|3/3/2024 10:17 AM|Q1 2024
|14-Apr-2010 00:23:13|4/14/2010|Wednesday, April 14, 2010|04142010 0:23|14/4/2010 12:23 AM|Q2 2010


### D3. Mapping time to time periods

These Datetimes to period mappings were done using different by-example transformations on the same data set. Bold strings represent the examples that were given in their respective transformation.

|DateTime|Period(Seconds)|Period(Minutes)|Period(Two Hours)|Period(30 Minutes)|
|-----:|-----:|-----:|-----:|-----:|
|31-Jan-2031 05:54:18|**0-20**|**45-60**|**5AM-7AM**|**5:30-6:00**|
|17-Jan-1990 13:32:01|**0-20**|30-45|1PM-3PM|13:30-14:00|
|14-Feb-2034 05:36:07|0-20|30-45|5AM-7AM|5:30-6:00|
|14-Mar-2002 13:16:16|0-20|15-30|1PM-3PM|13:00-13:30|
|21-Jan-1985 05:44:43|40-60|30-45|5AM-7AM|5:30-6:00|
|16-Aug-1985 01:11:56|40-60|0-15|1AM-3AM|1:00-1:30|
|20-Dec-2033 18:36:29|20-40|30-45|5PM-7PM|18:30-19:00|
|16-Jul-1984 10:21:59|40-60|15-30|9AM-11AM|10:00-10:30|
|13-Jan-2038 10:59:36|20-40|45-60|9AM-11AM|10:30-11:00|
|14-Aug-1982 15:13:54|40-60|0-15|3PM-5PM|15:00-15:30|
|22-Nov-2030 08:18:08|0-20|15-30|7AM-9AM|8:00-8:30|
|21-Oct-1997 08:42:58|40-60|30-45|7AM-9AM|8:30-9:00|
|28-Nov-2006 14:19:15|0-20|15-30|1PM-3PM|14:00-14:30|
|29-Apr-2031 04:59:45|40-60|45-60|3AM-5AM|4:30-5:00|
|29-Jan-2032 02:38:36|20-40|30-45|1AM-3AM|2:30-3:00|
|11-May-2028 15:31:52|40-60|30-45|3PM-5PM|15:30-16:00|
|15-Jul-1977 12:45:39|20-40|45-60|11AM-1PM|12:30-13:00|
|27-Jan-2029 05:55:41|40-60|45-60|5AM-7AM|5:30-6:00|
|03-Mar-2024 10:17:49|40-60|15-30|9AM-11AM|10:00-10:30|
|14-Apr-2010 00:23:13|0-20|15-30|11PM-1AM|0:00-0:30|

## Examples of composite transformations by example

|tripduration|starttime|start station id|start station latitude|start station longitude|usertype|Column|
|-----:|-----:|-----:|-----:|-----:|-----:|-----:|
|61|2016-01-08 16:09:32|107|42.3625|-71.08822|Subscriber|**A Subscriber picked a bike from station 107, lat/long (42.363,-71.088), on Jan 08, 2016 at around 4PM. The trip duration was 61 minutes**|
|61|2016-01-17 09:28:10|74|42.373268|-71.118579|Customer|A Customer picked a bike from station 74, lat/long (42.373,-71.119), on Jan 17, 2016 at around 9AM. The trip duration was 61 minutes|
|62|2016-01-25 08:10:26|176|42.386748020450561|-71.119018793106079|Subscriber|A Subscriber picked a bike from station 176, lat/long (42.387,-71.119), on Jan 25, 2016 at around 8AM. The trip duration was 62 minutes|
|63|2016-01-08 10:10:29|107|42.3625|-71.08822|Subscriber|A Subscriber picked a bike from station 107, lat/long (42.363,-71.088), on Jan 08, 2016 at around 10AM. The trip duration was 63 minutes|
|64|2016-01-15 19:42:08|68|42.36507|-71.1031|Subscriber|A Subscriber picked a bike from station 68, lat/long (42.365,-71.103), on Jan 15, 2016 at around 7PM. The trip duration was 64 minutes|
|64|2016-01-22 18:16:13|115|42.387995|-71.119084|Subscriber|A Subscriber picked a bike from station 115, lat/long (42.388,-71.119), on Jan 22, 2016 at around 6PM. The trip duration was 64 minutes|
|68|2016-01-18 09:51:52|178|42.359573201090441|-71.101294755935669|Subscriber|A Subscriber picked a bike from station 178, lat/long (42.360,-71.101), on Jan 18, 2016 at around 9AM. The trip duration was 68 minutes|
|69|2016-01-14 08:57:55|176|42.386748020450561|-71.119018793106079|Subscriber|A Subscriber picked a bike from station 176, lat/long (42.387,-71.119), on Jan 14, 2016 at around 8AM. The trip duration was 69 minutes|
|69|2016-01-13 22:12:55|141|42.363560158429884|-71.08216792345047|Subscriber|A Subscriber picked a bike from station 141, lat/long (42.364,-71.082), on Jan 13, 2016 at around 10PM. The trip duration was 69 minutes|
|69|2016-01-15 08:13:09|176|42.386748020450561|-71.119018793106079|Subscriber|A Subscriber picked a bike from station 176, lat/long (42.387,-71.119), on Jan 15, 2016 at around 8AM. The trip duration was 69 minutes|


## Technical notes

### Conditional transformations
In some cases, a single transformation cannot be found that satisfies the given examples. In such cases, Derive Column by Example Transform attempts to group the inputs based on some pattern and learn separate transformation for each group. We call this **Conditional Transformation**. **Conditional Transformation** is attempted only for transformations with a single input column. 

### Reference
More information about the String Transformation by Example technology can be found in [this publication](https://www.microsoft.com/research/publication/automating-string-processing-spreadsheets-using-input-output-examples/).
