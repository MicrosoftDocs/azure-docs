---
title: Run code with code interpreter in Azure SRE Agent
description: Learn how to use code interpreter to execute Python code, run shell commands, and generate reports in an isolated sandbox environment.
#customer intent: As a developer, I want to execute Python code in a secure sandbox so that I can analyze data and create visualizations without leaving the Azure SRE Agent interface.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-sre-agent
ms.topic: how-to
ms.date: 01/26/2026
---

# Run code by using code interpreter in Azure SRE Agent

The SRE Agent code interpreter enables you to execute Python code and shell commands in a secure, isolated sandbox environment. Use Code Interpreter to analyze data, create visualizations, generate PDF reports, and automate file operations without leaving your SRE Agent conversation.

In this article, you learn how to:

> [!div class="checklist"]
> - Execute Python code to analyze data and create visualizations
> - Run shell commands for file operations
> - Generate and download PDF reports
> - Work with files in the sandbox environment

## Prerequisites

[!INCLUDE [prerequisites](includes/prerequisites.md)]

## How code interpreter works

The SRE Agent code interpreter runs in an isolated Azure Container Apps session with the following characteristics:

- **No network access**: The sandbox can't make outbound HTTP or HTTPS requests.
- **No process spawning**: Commands like `subprocess` and `os.system` are blocked.
- **No package installation**: `pip install` and `conda install` aren't available.
- **Isolated file system**: All files must be saved to `/mnt/data/`.

These restrictions ensure that code execution is secure and predictable. Common data science libraries like pandas, matplotlib, and seaborn are preinstalled.

## Get started with code interpreter

Code interpreter tools are automatically available in your SRE Agent conversations. Ask the agent to perform tasks by using natural language.

### Example prompts

Try these prompts to get started:

- "Analyze this CSV data and create a chart showing incidents by category."
- "Generate a PDF summary of today's incidents."
- "Parse this JSON file and extract the error patterns."
- "List all files in the session and show their sizes."

### Your first Python script

The following example demonstrates how to create a visualization:

```python
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
categories = ['Critical', 'High', 'Medium', 'Low']
counts = [5, 12, 28, 45]

# Create bar chart
plt.figure(figsize=(10, 6))
plt.bar(categories, counts, color=['red', 'orange', 'yellow', 'green'])
plt.title('Incidents by Severity')
plt.xlabel('Severity Level')
plt.ylabel('Count')
plt.savefig('/mnt/data/incidents_by_severity.png', dpi=150)
```

When the code runs successfully, the agent returns the image inline in the conversation.

## Scenarios

### Analyze incident data

Use code interpreter to transform raw incident data into actionable insights and visualizations.

1. Ask SRE Agent to create a CSV file of all the incidents that have occurred within the last month using the following prompt:

    ```text
    Create a CSV file of all the incidents that 
    occurred in the last month.

    Name the file `incidents.csv` and save it
    to `/mnt/data`.
    ```

1. Use Python to analyze incident patterns and identify trends:

    ```python
    import pandas as pd
    
    # Load incident data
    df = pd.read_csv('/mnt/data/incidents.csv')
    
    # Calculate summary statistics
    summary = df.groupby('category').agg({
        'id': 'count',
        'resolution_time': 'mean'
    }).rename(columns={'id': 'count', 'resolution_time': 'avg_resolution_hours'})
    
    # Export results
    summary.to_csv('/mnt/data/incident_summary.csv')
    print(summary)
    ```

### Create visualizations

Generate charts to communicate insights.

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('/mnt/data/incidents.csv')

# Create visualization
plt.figure(figsize=(12, 6))
sns.barplot(data=df, x='category', y='count', palette='viridis')
plt.title('Incidents by Category')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('/mnt/data/category_chart.png', dpi=150)
```

### Generate PDF reports

Create formatted PDF documents for stakeholders.

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Create PDF
c = canvas.Canvas('/mnt/data/weekly_report.pdf', pagesize=letter)

# Add content
c.setFont('Helvetica-Bold', 18)
c.drawString(72, 750, 'Weekly Incident Report')

c.setFont('Helvetica', 12)
c.drawString(72, 720, 'Period: January 10-17, 2026')
c.drawString(72, 700, 'Total incidents: 90')
c.drawString(72, 680, 'Critical incidents: 5')
c.drawString(72, 660, 'Average resolution time: 4.2 hours')

c.save()
```

The agent returns a download link for the generated PDF.

### Process log files

Search and analyze log files by using shell commands.

```bash
# Count error occurrences by type
grep -E "ERROR|WARN|FATAL" application.log | sort | uniq -c | sort -rn
```

```bash
# Find the most recent log entries
tail -100 application.log
```

## Tool reference

Code Interpreter provides the following tools:

### ExecutePythonCode

Runs Python code in an isolated sandbox.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pythonCode` | string | Yes | Python code to run (up to 20,000 characters) |
| `timeoutSeconds` | integer | No | Execution timeout in seconds (default: 120, maximum: 900) |

**Output**: Images show inline as markdown. Data files return as download links.

### GeneratePdfReport

Creates PDF documents from Python code.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pythonCode` | string | Yes | Python code that creates a PDF file |
| `expectedOutputFilename` | string | Yes | Path where the PDF is saved (for example, `report.pdf`) |
| `saveAsFilename` | string | Yes | Download filename (for example, `daily_summary.pdf`) |
| `timeoutSeconds` | integer | No | Execution timeout in seconds (default: 180, maximum: 900) |

### RunShellCommand

Runs shell commands in the sandbox.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `command` | string | Yes | Shell command to run |
| `explanation` | string | No | Description to log with the command |
| `isBackground` | boolean | No | Must be `false` (background jobs aren't supported) |
| `timeoutSeconds` | integer | No | Execution timeout (default: 120, max: 240) |

> [!NOTE]
> The commands run from `/mnt/data/`. Use relative paths and chain commands by using `;` instead of `&&`.

### File operations

| Tool | Description |
|------|-------------|
| `ReadSessionFile` | Reads the contents of a file from `/mnt/data/`. |
| `SearchSessionFiles` | Searches for text within files using grep-style patterns. |
| `ListSessionFiles` | Lists all files in the session with metadata. |
| `GetSessionFile` | Downloads a file from the session. |
| `UploadFileToSession` | Uploads a file for further processing. |

#### Supported file types

- **Images**: PNG, JPG, GIF, SVG, WebP, BMP, TIFF, EPS
- **Data**: CSV, TSV, Excel, JSON, XML, YAML, HDF5, NetCDF, pickle
- **Documents**: PDF, HTML, Markdown, Office formats
- **Code**: Python, Jupyter notebooks, R, SQL
- **Archives**: ZIP, TAR, GZ

## Limitations

For security reasons, the system blocks the following operations:

| Category | Blocked operations |
|----------|-------------------|
| Process spawning | `subprocess`, `os.system`, `os.popen`, `os.spawn*` |
| Network access | Outbound HTTP/HTTPS requests |
| Package installation | `pip install`, `conda install` |
| File system | Access outside `/mnt/data/` |

## Troubleshoot code interpreter

### Code execution fails

- Verify your code doesn't use blocked operations like `subprocess` or network calls.
- Check that all file paths point to `/mnt/data/`.
- Ensure your code is under 20,000 characters.

### Files don't appear in output

- Confirm you save files to `/mnt/data/`.
- Use `ListSessionFiles` to verify file creation.
- Check that the file extension is supported.

### Timeout errors

- Increase the `timeoutSeconds` parameter (maximum 900 seconds).
- Optimize your code to reduce execution time.
- Split large operations into smaller chunks.

## Related content

- [Memory system](memory-system.md)
- [Build subagents](subagent-builder-scenarios.md)
- [Starter prompts](prompts.md)
