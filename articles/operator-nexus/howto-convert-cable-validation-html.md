---
title: How to Convert Network Fabric Cable Validation Report to HTML
description: Learn how to convert Nexus Network Fabric Cable Validation Report to HTML.
author: bpinto
ms.author: bpinto
titleSuffix: Azure Operator Nexus
ms.service: azure-operator-nexus
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 12/10/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---
# How to Convert Network Fabric Cable Validation Report to HTML

This article explains how to convert a Nexus Network Fabric Cable Validation Report from JSON output to HTML.

## Prerequisites

- Requires Python 3.11 or later
- Requires Python 3.11 Modules: `json pandas as pd datetime`

## Python Script for Cable Validation JSON to HTML Conversion

```
import json
import pandas as pd
from datetime import datetime

def color_status(val):
    """
    Takes a scalar and returns a string with
    the css property `'color: green'` for compliant,
    `'color: red'` for noncompliant and black for others
    """
    if val == 'Compliant':
        color = 'green'
    elif val == 'NonCompliant':
        color = 'red'
    else:
        color = 'black'
    return 'color: %s' % color

now = datetime.now() # current date and time
date_time = now.strftime("%m-%d-%Y-%H-%M")
print("date and time:",date_time)

# Get the file name as input from the user
file_name = input("Please provide post validation json file: ")
# Load the JSON data from the file
with open(file_name, 'r') as f:
    data = json.load(f)

# Prepare two lists to store the data
cable_validation_data = []
cable_specification_validation_data = []

# Loop through each rack in the racks list
for rack in data['racks']:
    # Loop through each device in the networkConfiguration list
    for device in rack['rackInfo']['networkConfiguration']['networkDevices']:
        # Loop through each interface map for the device
        for interface_map in device['fixedInterfaceMaps']:
            # Loop through each validation result for the interface map
            for validation_result in interface_map['validationResult']:
                # Append the data to the list based on validation type
                temp_item = [device['name'], interface_map['name'], validation_result['status'], interface_map['destinationHostname'], interface_map['destinationPort'],validation_result['validationDetails']['deviceConfiguration'], validation_result['validationDetails']['error'] , validation_result['validationDetails']['reason'],'FixedInterface']
                if validation_result['validationType'] == 'CableValidation':
                    cable_validation_data.append(temp_item)
                elif validation_result['validationType'] == 'CableSpecificationValidation':
                    cable_specification_validation_data.append(temp_item)

        # Check if scaleSpecificInterfaceMaps is not None
        if device['scaleSpecificInterfaceMaps'] is not None:   
            # Loop through each scaleSpecificInterface_Map for the interface map
            for scale_map in device['scaleSpecificInterfaceMaps']:
                # Loop through each interface map for the device.
                for interfacemaps in scale_map['InterfaceMaps']:
                    # Loop through each validation result for the scaleSpecificInterface_Map
                    for validation_result in interfacemaps['validationResult']:
                        # Append the data to the list
                        temp_item = [device['name'], interfacemaps['name'], validation_result['status'], interfacemaps['destinationHostname'], interfacemaps['destinationPort'], validation_result['validationDetails']['deviceConfiguration'], validation_result['validationDetails']['error'] , validation_result['validationDetails']['reason'], 'ScaleSpecificInterface']
                        if validation_result['validationType'] == 'CableValidation':
                            cable_validation_data.append(temp_item)
                        elif validation_result['validationType'] == 'CableSpecificationValidation':
                            cable_specification_validation_data.append(temp_item)

# Convert the lists to DataFrames
cable_validation_df = pd.DataFrame(cable_validation_data, columns=['Device Name', 'Interface Map Name', 'Status', 'Destination Hostname', 'Destination Port', 'Device Configuration', 'Error', 'Reason', 'Interface Type'])
cable_specification_validation_df = pd.DataFrame(cable_specification_validation_data, columns=['Device Name', 'Interface Map Name', 'Status', 'Destination Hostname', 'Destination Port', 'Device Configuration', 'Error', 'Reason', 'Interface Type'])

# Group the DataFrames by 'Status' and append each group's HTML representation to a string
#html_string = '<html><head><style>table {border-collapse: collapse;} th, td {border: 1px solid black; padding: 5px;}</style></head><body>'
html_string = """
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 960px;  /* Set the maximum width of the page */
            margin: 0 auto;  /* Center the page */
        }
        h2 {color: #2A2A2A;}
        table {border-collapse: collapse; width: 100%;}
        th, td {border: 1px solid #ddd; padding: 8px;}
        tr:nth-child(even) {background-color: #f2f2f2;}
        th {padding-top: 12px; padding-bottom: 12px; text-align: left; background-color: #4CAF50; color: white;}
    </style>
</head>
<body>
"""
for status, group_df in cable_validation_df.groupby('Status'):
    styled_group_df = group_df.style.applymap(color_status, subset=['Status']).set_table_attributes('class="dataframe"')
    html_string += f'<h2>Cable Validation - {status}</h2>'
    html_string += styled_group_df.to_html()

for status, group_df in cable_specification_validation_df.groupby('Status'):
    styled_group_df = group_df.style.applymap(color_status, subset=['Status']).set_table_attributes('class="dataframe"')
    html_string += f'<h2>Cable Specification Validation - {status}</h2>'
    html_string += styled_group_df.to_html()

html_string += '</body></html>'

# Write the string to an HTML file
with open('CableValidationAndSpecification-{filename}.html'.format(filename = date_time), 'w') as f:
    f.write(html_string)
```

## Usage
To run the conversion tool, execute the following command:
```
python cable-html.py
..
Please provide post validation json file: <CABLE_VALIDATION_FILENAME>.json
```

The report output has filename `CableValidationAndSpecification-<DATE>.html`.

## Cable Validation Report HTML results

The report is separated into the following sections:
- Cable Validation - Compliant
- Cable Validation - NonCompliant
- Cable Validation - Unknown
- Cable Specification Validation - Compliant
- Cable Specification Validation - NonCompliant
- Cable Specification Validation - Unknown

Sample report:
:::image type="content" source="media\cable-validation-html.png" alt-text="Screenshot that shows the sample cable validation report." lightbox="media\cable-validation-html.png":::
