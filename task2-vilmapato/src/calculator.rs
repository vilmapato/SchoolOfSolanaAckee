///-------------------------------------------------------------------------------
///
/// This is your calculator implementation task 
/// to practice enums, structs, and methods.
/// 
/// Complete the implementation of the Calculator struct and its methods.
/// 
/// The calculator should support basic arithmetic 
/// operations (addition, subtraction, multiplication)
/// with overflow protection and maintain a history 
/// of operations.
/// 
/// Tasks:
/// 1. Implement the OperationType enum methods
/// 2. Implement the Operation struct constructor
/// 3. Implement all Calculator methods
/// 
///-------------------------------------------------------------------------------

#[derive(Clone)]
pub enum OperationType {
    Addition,
    Subtraction,
    Multiplication
}

impl OperationType {
    // TODO: Return the string representation of the operation sign
    // Addition -> "+", Subtraction -> "-", Multiplication -> "*"
    pub fn get_sign(&self) -> &str {
        if let OperationType::Addition = self {
            "+"
        } else if let OperationType::Subtraction = self {
            "-"
        } else {
            "*"
        }
    }
    
    // TODO: Perform the operation on two i64 numbers with overflow protection
    // Return Some(result) on success, None on overflow
    //
    // Example: OperationType::Multiplication.perform(x, y)
    pub fn perform(&self, x: i64, y: i64) -> Option<i64> {
        match self {
            OperationType::Addition => x.checked_add(y), // this performs the addition operation but checks for overflow
            OperationType::Subtraction => x.checked_sub(y),
            OperationType::Multiplication => x.checked_mul(y),
        }
    }
}

#[derive(Clone)]
pub struct Operation {
    pub first_num: i64,
    pub second_num: i64,
    pub operation_type: OperationType
}

impl Operation {
    // TODO: Create a new Operation with the given parameters
    pub fn new(first_num: i64, second_num: i64, operation_type: OperationType) -> Self {
        // creates a new operation instance so it can be used in the history 
        Operation {
            first_num,
            second_num,
            operation_type
        }

    }
}

pub struct Calculator {
    pub history: Vec<Operation>
}

impl Calculator {
    // TODO: Create a new Calculator with empty history
    pub fn new() -> Self {
        Calculator {
            history: Vec::new()
        }
    }
    
    // TODO: Perform addition and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn addition(&mut self, x: i64, y: i64) -> Option<i64> {
        let operation_type = OperationType::Addition; // this defines the operation type as addition
        // Perform the operation and check for overflow
        if let Some(result) = operation_type.perform(x, y) {
            self.history.push(Operation::new(x, y, operation_type));
            return Some(result);
        }
        None
    }
    
    // TODO: Perform subtraction and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn subtraction(&mut self, x: i64, y: i64) -> Option<i64> {
        let operation_type = OperationType::Subtraction; // this defines the operation type as subtraction
        // Perform the operation and check for overflow
        if let Some(result) = operation_type.perform(x, y) {
            self.history.push(Operation::new(x, y, operation_type));
            return Some(result);
        }
        None
    }
    
    // TODO: Perform multiplication and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn multiplication(&mut self, x: i64, y: i64) -> Option<i64> {
        let operation_type = OperationType::Multiplication; // this defines the operation type as multiplication
        // Perform the operation and check for overflow
        if let Some(result) = operation_type.perform(x, y) {
            self.history.push(Operation::new(x, y, operation_type));
            return Some(result);    
        }
        None
    }
    
    // TODO: Generate a formatted string showing all operations in history
    // Format: "index: first_num operation_sign second_num = result\n"
    //
    // Example: "0: 5 + 3 = 8\n1: 10 - 2 = 8\n"
    pub fn show_history(&self) -> String{
        let mut history_string = String::new();
        for (index, operation) in self.history.iter().enumerate() {
            if let Some(result) = operation.operation_type.perform(operation.first_num, operation.second_num) {
                history_string.push_str(&format!("{}: {} {} {} = {}\n", index, operation.first_num, operation.operation_type.get_sign(), operation.second_num, result));
            }
        }
        history_string
    }
    
    // TODO: Repeat an operation from history by index
    // Add the repeated operation to history and return the result
    // Return None if the index is invalid
    pub fn repeat(&mut self, operation_index: usize) -> Option<i64>{
        if operation_index < self.history.len() {
            let operation = &self.history[operation_index];
            if let Some(result) = operation.operation_type.perform(operation.first_num, operation.second_num) {
                self.history.push(Operation::new(operation.first_num, operation.second_num, operation.operation_type.clone()));
                return Some(result);
            }
        }
        None
    }
    
    // TODO: Clear all operations from history
    pub fn clear_history(&mut self) {
        self.history.clear(); // this clears the history of the calculator
    }
}
