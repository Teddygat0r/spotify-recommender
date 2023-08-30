import json
import requests
from bs4 import BeautifulSoup

def load_data_from_json(file_path):
    try:
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
            return data
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
        return []

def get_track_info(track_id):
    url = f"https://open.spotify.com/track/{track_id}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        return f"Error fetching track info for track ID {track_id}"

def find_image_src(html_content, alt_text):
    soup = BeautifulSoup(html_content, 'html.parser')
    print()
    img_tag = soup.find('img')
    if img_tag:
        return img_tag['src']
    return None

if __name__ == "__main__":
    json_file_path = "tracks_modified.json"  # Change this to your actual JSON file path
    
    data_objects = load_data_from_json(json_file_path)
    
    modified_data = []
    
    for obj in data_objects:
        track_id = obj.get("track_id")
        track_name = obj.get("track_name")
        if track_id and obj.get("cover_src") == "No image found" :
            track_info = get_track_info(track_id)
            img_src = find_image_src(track_info, track_name)
            obj["cover_src"] = img_src if img_src else "No image found"
        modified_data.append(obj)
    
    modified_json_file = "tracks_modified_2.json"
    with open(modified_json_file, 'w') as json_out:
        json.dump(modified_data, json_out, indent=4)
    
    print(f"Modified data saved to '{modified_json_file}'.")