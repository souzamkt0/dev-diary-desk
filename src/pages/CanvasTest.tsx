import React from 'react';

export default function CanvasTest() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Canvas Test</h1>
        <p className="text-gray-600">Se você está vendo esta página, o Canvas está funcionando!</p>
        <div className="mt-4 p-4 bg-orange-100 rounded-lg">
          <p className="text-orange-800">Teste de carregamento bem-sucedido!</p>
        </div>
      </div>
    </div>
  );
}
