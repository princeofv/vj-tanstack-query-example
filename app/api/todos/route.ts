// app/api/todos/route.ts
import { NextResponse } from "next/server";

let todos = [
  { id: 1, text: "Learn TypeScript" },
  { id: 2, text: "Learn Next.js" },
];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { text }: { text: string } = await request.json();
  const newTodo = { id: todos.length + 1, text };
  todos.push(newTodo);
  return NextResponse.json(newTodo, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  todos = todos.filter((todo) => todo.id !== id);
  return NextResponse.json({ message: "Todo deleted" });
}
