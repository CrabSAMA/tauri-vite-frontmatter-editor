// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use gray_matter::engine::YAML;
// use gray_matter::Matter;
// use serde::{Deserialize, Serialize};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

// #[tauri::command]
// fn parse_frontmatter(content: &str) -> String {
//     #[derive(Serialize, Deserialize, Debug)]
//     struct FrontMatter {
//         title: String,
//         isOriginal: bool,
//         date: String,
//         category: Vec<String>,
//         tag: Vec<String>,
//         star: bool,
//     }

//     let matter = Matter::<YAML>::new();
//     let result = matter.parse(content);
//     let front_matter: FrontMatter = result.data.unwrap().deserialize().unwrap();
//     let json_string = serde_json::to_string(&front_matter);
//     return json_string.unwrap();
// }

#[tauri::command]
fn read_file(path: &str) -> String {
    return std::fs::read_to_string(path).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
