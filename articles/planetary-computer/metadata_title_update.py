#!/usr/bin/env python3
"""
This script updates the "title:" field in the metadata of Markdown files 
based on the values from metadata_index.csv.
It specifically targets the title field as the second line of the file.
"""

import os
import csv
import sys
from pathlib import Path

def update_title_in_file(file_path, new_title):
    """
    Update the title metadata in the given Markdown file,
    assuming title is always on the second line.
    
    Args:
        file_path: Path to the Markdown file
        new_title: New title to set in the metadata
    
    Returns:
        bool: True if file was updated, False otherwise
    """
    try:
        # Read all lines from the file
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Check if file has at least 3 lines and starts with front matter
        if len(lines) < 3 or not lines[0].strip() == '---':
            print(f"  Warning: {file_path} does not have proper metadata section")
            return False
        
        # Check if second line contains title
        if not lines[1].startswith('title:'):
            print(f"  Warning: Second line of {file_path} is not title field")
            return False
        
        # Update the title line
        lines[1] = f'title: {new_title}\n'
        
        # Write the updated content back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        return True
            
    except Exception as e:
        print(f"  Error processing {file_path}: {e}")
        return False

def main():
    base_dir = Path('/home/prasadkomma/azure-docs-pr/articles/planetary-computer')
    csv_path = base_dir / 'metadata_index.csv'
    
    if not csv_path.exists():
        print(f"Error: CSV file not found at {csv_path}")
        sys.exit(1)
    
    updated_count = 0
    error_count = 0
    skipped_count = 0
    
    print(f"Processing titles from {csv_path}")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as csvfile:
            # Skip the first line if it contains a filepath comment
            first_line = csvfile.readline()
            if '// filepath:' in first_line:
                csvfile.seek(0)
                next(csvfile)
            else:
                csvfile.seek(0)
            
            csv_reader = csv.DictReader(csvfile)
            
            for row in csv_reader:
                # Skip if file name or title is missing
                if not row.get('file name') or not row.get('title'):
                    skipped_count += 1
                    continue
                
                filename = row['file name'].strip()
                new_title = row['title'].strip()
                
                file_path = base_dir / filename
                
                # Skip article_links_diagram.md which doesn't have proper metadata
                if filename == 'article_links_diagram.md':
                    print(f"Skipping {filename} (diagram file)")
                    skipped_count += 1
                    continue
                
                print(f"Processing {filename}...")
                
                if not file_path.exists():
                    print(f"  Warning: File not found: {file_path}")
                    error_count += 1
                    continue
                
                if update_title_in_file(file_path, new_title):
                    updated_count += 1
                    print(f"  Updated title to: {new_title}")
                else:
                    error_count += 1
    
    except Exception as e:
        print(f"Error processing CSV: {e}")
        sys.exit(1)
    
    print("\nSummary:")
    print(f"  {updated_count} files updated successfully")
    print(f"  {error_count} files had errors")
    print(f"  {skipped_count} files skipped")

if __name__ == "__main__":
    main()
