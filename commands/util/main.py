import json

# Load the JSON data from file
with open("data.json") as f:
    data = json.load(f)

# Write the data to a text file
with open("data.txt", "w") as f:
    for group in data["wild_encounter_groups"]:
        for field in group["fields"]:
            f.write("Type: " + field["type"] + "\n")
            f.write("Encounter rates: " + str(field["encounter_rates"]) + "\n")
            if "groups" in field:
                f.write("Groups: " + str(field["groups"]) + "\n")
        for encounter in group["encounters"]:
            f.write("Map: " + encounter["map"] + "\n")
            f.write("Base label: " + encounter["base_label"] + "\n")
            for environment in encounter:
                if environment == "land_mons" or environment == "water_mons" or environment == "rock_smash_mons" or environment == "fishing_mons" or environment == "hidden_mons":
                    f.write("Environment: " + environment + "\n")
                    f.write("Encounter rate: " + str(encounter[environment]["encounter_rate"]) + "\n")
                    f.write("Species:\n")
                    for species in encounter[environment]["mons"]:
                        f.write("Min level: " + str(species["min_level"]) + "\n")
                        f.write("Max level: " + str(species["max_level"]) + "\n")
                        f.write("Species: " + species["species"] + "\n")
            f.write("\n")
