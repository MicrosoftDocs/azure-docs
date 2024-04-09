#!/bin/bash

# Path to the TOC.yml file
tocPath="../TOC.yml"

# Check if the TOC.yml file exists
if [ ! -f "$tocPath" ]; then
  echo "TOC.yml file does not exist in the parent directory."
  exit 1
fi

# The directory where the markdown files are located relative to the script
mdFilesDir="../flexible-server/"

# Check if the markdown files directory exists
if [ ! -d "$mdFilesDir" ]; then
  echo "Markdown files directory does not exist."
  exit 1
fi

# Loop through all .md files in the markdown files directory
for mdFileFullPath in "$mdFilesDir"*.md; do
  # Extracting the filename with path relative to the parent directory
  relativePath="${mdFileFullPath#../}"

  # Creating the search pattern expected in the TOC.yml
  searchPattern=" href: ${relativePath}"

  # Check if the pattern exists in the TOC.yml file
  if ! grep -q "$searchPattern" "$tocPath"; then
    # Print the relative path of the .md file from the parent directory
    echo "$relativePath"
  fi
done
