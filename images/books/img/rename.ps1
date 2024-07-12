# Get the current directory where the script is located
$currentDirectory = Get-Location

# Get all JPG files in the current directory
$files = Get-ChildItem -Path $currentDirectory -Filter "WB-*.jpg"

# Sort files by name to ensure sequential numbering
$files = $files | Sort-Object Name

# Counter to track the number
$counter = 1  # Start with 1 for the new naming convention

# Loop through each file and rename it
foreach ($file in $files) {
    # Extract the original number from the file name and convert to integer
    $originalNumber = [int]($file.BaseName.Split('-')[1])

    # Calculate the new number (incremented by 1)
    $newNumber = $originalNumber + 1
    
    # Formulate the new name with incremented number
    $newName = "JUNIOR EXPRESS - WB-$newNumber.jpg"
    
    # Construct the full path for renaming
    $newPath = Join-Path -Path $currentDirectory -ChildPath $newName
    
    # Rename the file
    Rename-Item -Path $file.FullName -NewName $newPath
    
    # Increment counter for the next file
    $counter++
}
