```
import json
import pandas as pd
from datetime import datetime

now = datetime.now() # current date and time
date_time = now.strftime("%m-%d-%Y-%H-%M")
print("date and time:",date_time)


# Get the file name as input from the user
file_name = input("Please provide post validation json file: ")
# Load the JSON data from the file
with open(file_name, 'r') as f:
    data = json.load(f)

# Prepare a list to store the data
data_list = []

# Loop through each rack in the racks list
for rack in data['racks']:
    # Loop through each device in the networkDevices list
    for device in rack['rackInfo']['networkConfiguration']['networkDevices']:
        # Loop through each interface map for the device
        for interface_map in device['fixedInterfaceMaps']:
            # Loop through each validation result for the interface map
            for validation_result in interface_map['validationResult']:
                # Append the data to the list
                temp_item = [device['name'], interface_map['name'], validation_result['status'], interface_map['destinationHostname'], interface_map['destinationPort'],validation_result['validationDetails']['deviceConfiguration'], validation_result['validationDetails']['error'] , validation_result['validationDetails']['reason'],'FixedInterface']
                # print(temp_item)
                data_list.append(temp_item)

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
                        # print(temp_item)
                        data_list.append(temp_item)

# # Check if scaleSpecificInterfaceMaps is not None
#         if device['topologySpecificInterfaceMaps'] is not None:   
#             # Loop through each scaleSpecificInterface_Map for the interface map
#             for topo_map in device['topologySpecificInterfaceMaps']:
#                 # Loop through each interface map for the device.
#                 for interfacemaps in topo_map['InterfaceMaps']:
#                     # Loop through each validation result for the scaleSpecificInterface_Map
#                     for validation_result in interfacemaps['validationResult']:
#                         # Append the data to the list
#                         data_list.append([device['name'], interfacemaps['name'], validation_result['status'], interface_map['destinationHostname'], interface_map['destinationPort'], validation_result['validationDetails']['deviceConfiguration'], validation_result['validationDetails']['error'] , validation_result['validationDetails']['reason'], 'TopologySpecificInterface'])

# Convert the list to a DataFrame
df = pd.DataFrame(data_list, columns=['Device Name', 'Interface Map Name', 'Validation Result Status', 'Destination Hostname ', 'Destination Port ','Device Configuration', 'Error', 'Reason','Map Type'])

# Function to apply color based on validation result
def color_status(val):
    color = 'red' if val == 'NonCompliant' else 'green' if val == 'Compliant' else 'black'
    return 'color: %s' % color

# Apply the color to the DataFrame
styled_df = df.style.applymap(color_status, subset=['Validation Result Status'])

# Set CSS properties for th elements in dataframe
th_props = [
  ('font-size', '18px'),
  ('text-align', 'center'),
  ('font-weight', 'bold'),
  ('color', '#6d6d6d'),
  ('background-color', '#f7f7f9')
  ]

# Set CSS properties for td elements in dataframe
td_props = [
  ('font-size', '16px')
  ]

# Set table styles
styles = [
  dict(selector="th", props=th_props),
  dict(selector="td", props=td_props)
  ]

# Filter the DataFrame based on the 'Validation Result Status' column
df_compliant = df[df['Validation Result Status'] == 'Compliant']
df_noncompliant = df[df['Validation Result Status'] == 'NonCompliant']
df_unknown = df[df['Validation Result Status'] == 'Unknown']

# Apply the color to the DataFrames
styled_df_compliant = df_compliant.style.applymap(color_status, subset=['Validation Result Status'])
styled_df_noncompliant = df_noncompliant.style.applymap(color_status, subset=['Validation Result Status'])
styled_df_unknown = df_unknown.style.applymap(color_status, subset=['Validation Result Status'])

# Generate the DataFrames' HTML strings
df_html_compliant = styled_df_compliant.set_table_styles(styles).to_html()
df_html_noncompliant = styled_df_noncompliant.set_table_styles(styles).to_html()
df_html_unknown = styled_df_unknown.set_table_styles(styles).to_html()

# Combine the HTML strings
html = f"""
<html>
<head>
    <style>
        body {{
            background-color: #f0f0f5;
        }}
        .box {{
            border: 1px solid black;
            margin: 10px;
            padding: 10px;
        }}
    </style>
</head>
<body>
    <div class="box">
        <h2>Compliant</h2>
        {df_html_compliant}
    </div>
    <div class="box">
        <h2>NonCompliant</h2>
        {df_html_noncompliant}
    </div>
    <div class="box">
        <h2>Unknown</h2>
        {df_html_unknown}
    </div>
</body>
</html>
"""

# Save the HTML string to a file
with open("reports/report-{filename}.html".format(filename = date_time), 'w') as f:
    f.write(html)
```
