use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct DataProcessor {
    data: Vec<i32>,
}

#[wasm_bindgen]
impl DataProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        DataProcessor { data: Vec::new() }
    }

    pub fn process_data(&mut self, input: Vec<i32>) -> Vec<i32> {
        self.data = input;
        self.data.sort();
        self.data.dedup();
        self.data.iter().map(|x| x * 2).collect()
    }

    pub fn get_statistics(&self) -> JsValue {
        let stats = serde_json::json!({
            "sum": self.data.iter().sum::<i32>(),
            "average": if !self.data.is_empty() {
                self.data.iter().sum::<i32>() as f64 / self.data.len() as f64
            } else {
                0.0
            },
            "count": self.data.len()
        });

        // Convert the JSON string directly to JsValue
        JsValue::from_str(&stats.to_string())
    }
}