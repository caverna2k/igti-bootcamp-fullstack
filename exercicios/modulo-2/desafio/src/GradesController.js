import { readFile, writeFile } from './utils/fileHandle';

class GradesController {
  async store(req, res) {
    const { student, subject, type, value } = req.body;

    const gradesFile = await readFile();

    const newGrade = {
      id: gradesFile.nextId,
      student,
      subject,
      type,
      value,
      timestamp: new Date(),
    };

    gradesFile.nextId += 1;
    gradesFile.grades.push(newGrade);

    await writeFile(gradesFile);

    return res.status(200).json(newGrade);
  }

  async save(req, res) {
    const { id } = req.params;
    const { student, subject, type, value } = req.body;

    const gradesFile = await readFile();
    const findGrade = gradesFile.grades.find(
      (grade) => grade.id === parseInt(id)
    );

    if (!findGrade) {
      return res.status(400).json({ error: 'Grade não encontrada!' });
    }

    const newGrades = gradesFile.grades.map((grade) => {
      if (grade.id === parseInt(id)) {
        return {
          id: parseInt(id),
          student: student || grade.student,
          subject: subject || grade.subject,
          type: type || grade.type,
          value: value || grade.value,
          timestamp: grade.timestamp,
        };
      }

      return grade;
    });

    gradesFile.grades = newGrades;

    await writeFile(gradesFile);

    return res.status(200).json(gradesFile);
  }

  async remove(req, res) {
    const { id } = req.params;

    const gradesFile = await readFile();
    const gradeIndex = gradesFile.grades.findIndex(
      (grade) => grade.id === parseInt(id)
    );

    if (!gradeIndex) {
      return res.status(400).json({ error: 'Grade não encontrada!' });
    }

    gradesFile.grades.splice(gradeIndex, 1);
    gradesFile.nextId -= 1;
    await writeFile(gradesFile);

    return res.status(200).json(gradesFile);
  }

  async findById(req, res) {
    const { id } = req.params;

    const gradesFile = await readFile();
    const findGrade = gradesFile.grades.find(
      (grade) => grade.id === parseInt(id)
    );

    if (!findGrade) {
      return res.status(400).json({ error: 'Grade não encontrada!' });
    }

    return res.status(200).json(findGrade);
  }

  async totalGrades(req, res) {
    const { student, subject } = req.query;

    const gradesFile = await readFile();
    const filteredGrades = gradesFile.grades.filter(
      (grade) => grade.student === student && grade.subject === subject
    );

    if (!filteredGrades) {
      return res.status(400).json({ error: 'Grade não encontrada!' });
    }

    const totalGrade = filteredGrades.reduce((acc, grade) => {
      return acc + grade.value;
    }, 0);

    return res.status(200).json({
      student,
      subject,
      totalGrade,
    });
  }

  async avgGrades(req, res) {
    const { type, subject } = req.query;

    const gradesFile = await readFile();
    const filteredGrades = gradesFile.grades.filter(
      (grade) => grade.type === type && grade.subject === subject
    );

    if (!filteredGrades) {
      return res.status(400).json({ error: 'Grade não encontrada!' });
    }

    const totalGrade = filteredGrades.reduce((acc, grade) => {
      return acc + grade.value;
    }, 0);

    return res.status(200).json({
      type,
      subject,
      avg: totalGrade / filteredGrades.length,
    });
  }

  async bestGrades(req, res) {
    const { type, subject } = req.query;

    const gradesFile = await readFile();
    const filteredGrades = gradesFile.grades.filter(
      (grade) => grade.type === type && grade.subject === subject
    );

    if (!filteredGrades) {
      return res.status(400).json({ error: 'Grade não encontrada!' });
    }

    const orderedGrades = filteredGrades
      .sort((a, b) => a.value - b.value)
      .reverse();

    return res.status(200).json(orderedGrades.slice(0, 3));
  }
}

export default new GradesController();
